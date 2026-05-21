import { demoProperties } from "@/lib/demo-data";
import { hasSupabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import type { Property } from "@/lib/types";
import type { PropertyFilters } from "@/features/properties/schema";

export type PropertyDataResult = {
  properties: Property[];
  isDemo: boolean;
  message?: string;
};

function normalize(value?: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function filterDemoProperties(filters: PropertyFilters) {
  const query = normalize(filters.q)?.toLowerCase();
  const location = normalize(filters.location)?.toLowerCase();
  const minPrice = filters.price_min ? Number(filters.price_min) : null;
  const maxPrice = filters.price_max ? Number(filters.price_max) : null;

  return demoProperties.filter((property) => {
    if (query) {
      const haystack = `${property.title} ${property.location} ${property.owner_name ?? ""} ${property.owner_phone ?? ""} ${property.notes ?? ""}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    if (filters.status && property.status !== filters.status) return false;
    if (filters.type && property.type !== filters.type) return false;
    if (filters.intent && property.intent !== filters.intent) return false;
    if (filters.bhk && String(property.bedrooms ?? "") !== filters.bhk) return false;
    if (location && !property.location.toLowerCase().includes(location)) return false;
    if (minPrice !== null && property.price < minPrice) return false;
    if (maxPrice !== null && property.price > maxPrice) return false;
    return true;
  });
}

export async function getProperties(filters: PropertyFilters): Promise<PropertyDataResult> {
  if (!hasSupabaseEnv()) {
    return {
      properties: filterDemoProperties(filters),
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
      properties: filterDemoProperties(filters),
      isDemo: true,
      message: "Sign in to save and manage live Supabase properties. Demo data is shown for now."
    };
  }

  let query = supabase
    .from("properties")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const search = normalize(filters.q);
  if (search) {
    query = query.or(
      `title.ilike.%${search}%,location.ilike.%${search}%,owner_name.ilike.%${search}%,owner_phone.ilike.%${search}%,notes.ilike.%${search}%`
    );
  }
  if (filters.status) query = query.eq("status", filters.status);
  if (filters.type) query = query.eq("type", filters.type);
  if (filters.intent) query = query.eq("intent", filters.intent);
  if (filters.bhk) query = query.eq("bedrooms", Number(filters.bhk));
  if (normalize(filters.location)) query = query.ilike("location", `%${filters.location}%`);
  if (filters.price_min) query = query.gte("price", Number(filters.price_min));
  if (filters.price_max) query = query.lte("price", Number(filters.price_max));

  const { data, error } = await query;

  if (error) {
    return {
      properties: filterDemoProperties(filters),
      isDemo: true,
      message: `${error.message}. Demo data is shown as a fallback.`
    };
  }

  return { properties: data ?? [], isDemo: false };
}
