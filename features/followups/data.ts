import { demoFollowups, demoClients, demoProperties } from "@/lib/demo-data";
import { hasSupabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import type { Followup } from "@/lib/types";
import type { FollowupFilters } from "@/features/followups/schema";

export type FollowupDataResult = {
  followups: Followup[];
  isDemo: boolean;
  message?: string;
};

function normalize(value?: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function filterDemoFollowups(filters: FollowupFilters): Followup[] {
  const query = normalize(filters.q)?.toLowerCase();
  const status = normalize(filters.status);
  const clientId = normalize(filters.client_id);
  const propertyId = normalize(filters.property_id);

  return demoFollowups.filter((followup) => {
    if (query) {
      const client = demoClients.find((c) => c.id === followup.client_id);
      const property = demoProperties.find((p) => p.id === followup.property_id);
      const haystack = `${followup.title} ${client?.full_name ?? ""} ${property?.title ?? ""} ${followup.notes ?? ""}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    if (status && status !== "all" && followup.status !== status) return false;
    if (clientId && followup.client_id !== clientId) return false;
    if (propertyId && followup.property_id !== propertyId) return false;
    return true;
  });
}

export async function getFollowups(filters: FollowupFilters): Promise<FollowupDataResult> {
  if (!hasSupabaseEnv()) {
    return {
      followups: filterDemoFollowups(filters),
      isDemo: true,
      message: "Demo data is shown until Supabase environment variables are configured."
    };
  }

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      followups: filterDemoFollowups(filters),
      isDemo: true,
      message: "Sign in to save and manage live Supabase follow-ups. Demo data is shown for now."
    };
  }

  // Fetch follow-ups
  let query = supabase
    .from("followups")
    .select("*")
    .eq("user_id", user.id)
    .order("due_at", { ascending: true });

  const status = normalize(filters.status);
  if (status && status !== "all") {
    query = query.eq("status", status);
  }
  const clientId = normalize(filters.client_id);
  if (clientId) {
    query = query.eq("client_id", clientId);
  }
  const propertyId = normalize(filters.property_id);
  if (propertyId) {
    query = query.eq("property_id", propertyId);
  }

  const { data, error } = await query;

  if (error) {
    return {
      followups: filterDemoFollowups(filters),
      isDemo: true,
      message: `${error.message}. Demo data is shown as a fallback.`
    };
  }

  let followups = (data as Followup[]) ?? [];

  // Implement client-side title search query if "q" is specified
  const search = normalize(filters.q)?.toLowerCase();
  if (search && followups.length > 0) {
    // To search by client/property name in live data, we also fetch the user's clients and properties
    const [clientsRes, propertiesRes] = await Promise.all([
      supabase.from("clients").select("id, full_name").eq("user_id", user.id),
      supabase.from("properties").select("id, title").eq("user_id", user.id)
    ]);

    const clientsData = (clientsRes.data ?? []) as { id: string; full_name: string }[];
    const propertiesData = (propertiesRes.data ?? []) as { id: string; title: string }[];

    const clientsMap = new Map<string, string>(clientsData.map(c => [c.id, c.full_name]));
    const propertiesMap = new Map<string, string>(propertiesData.map(p => [p.id, p.title]));

    followups = followups.filter((f) => {
      const clientName = f.client_id ? (clientsMap.get(f.client_id) ?? "") : "";
      const propertyTitle = f.property_id ? (propertiesMap.get(f.property_id) ?? "") : "";
      const haystack = `${f.title} ${clientName} ${propertyTitle} ${f.notes ?? ""}`.toLowerCase();
      return haystack.includes(search);
    });
  }

  return { followups, isDemo: false };
}
