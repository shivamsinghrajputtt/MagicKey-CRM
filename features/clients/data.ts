import type { Client } from "@/lib/types";
import { demoClients } from "@/lib/demo-data";
import { hasSupabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import type { ClientFilters } from "@/features/clients/schema";

export type ClientDataResult = {
  clients: Client[];
  isDemo: boolean;
  message?: string;
};

function normalize(value?: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function filterDemoClients(filters: ClientFilters) {
  const query = normalize(filters.q)?.toLowerCase();
  const location = normalize(filters.location)?.toLowerCase();
  const minBudget = filters.budget_min ? Number(filters.budget_min) : null;
  const maxBudget = filters.budget_max ? Number(filters.budget_max) : null;

  return demoClients.filter((client) => {
    if (query) {
      const haystack = `${client.full_name} ${client.phone} ${client.preferred_location ?? ""} ${client.notes ?? ""}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    if (filters.status && client.status !== filters.status) return false;
    if (filters.bhk && String(client.bhk ?? "") !== filters.bhk) return false;
    if (filters.furnished_type && client.furnished_type !== filters.furnished_type) return false;
    if (location && !(client.preferred_location ?? "").toLowerCase().includes(location)) return false;
    if (minBudget !== null && (client.budget ?? 0) < minBudget) return false;
    if (maxBudget !== null && (client.budget ?? Number.MAX_SAFE_INTEGER) > maxBudget) return false;
    return true;
  });
}

export async function getClients(filters: ClientFilters): Promise<ClientDataResult> {
  if (!hasSupabaseEnv()) {
    return {
      clients: filterDemoClients(filters),
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
      clients: filterDemoClients(filters),
      isDemo: true,
      message: "Sign in to save and manage live Supabase clients. Demo data is shown for now."
    };
  }

  let query = supabase
    .from("clients")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const search = normalize(filters.q);
  if (search) {
    query = query.or(
      `full_name.ilike.%${search}%,phone.ilike.%${search}%,preferred_location.ilike.%${search}%,notes.ilike.%${search}%`
    );
  }
  if (filters.status) query = query.eq("status", filters.status);
  if (filters.bhk) query = query.eq("bhk", Number(filters.bhk));
  if (filters.furnished_type) query = query.eq("furnished_type", filters.furnished_type);
  if (normalize(filters.location)) query = query.ilike("preferred_location", `%${filters.location}%`);
  if (filters.budget_min) query = query.gte("budget", Number(filters.budget_min));
  if (filters.budget_max) query = query.lte("budget", Number(filters.budget_max));

  const { data, error } = await query;

  if (error) {
    return {
      clients: filterDemoClients(filters),
      isDemo: true,
      message: `${error.message}. Demo data is shown as a fallback.`
    };
  }

  return { clients: data ?? [], isDemo: false };
}
