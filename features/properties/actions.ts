"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ZodError } from "zod";

import { propertyFormSchema, parseAmenities, type PropertyFormValues } from "@/features/properties/schema";
import { hasSupabaseEnv } from "@/lib/env";
import { createClient, ensureDbUser } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

export type PropertyActionState = {
  ok: boolean;
  message: string;
  fieldErrors?: Partial<Record<keyof PropertyFormValues, string>>;
};

function toFieldErrors(error: ZodError<PropertyFormValues>) {
  const flattened = error.flatten().fieldErrors;
  return Object.fromEntries(
    Object.entries(flattened).map(([key, value]) => [key, value?.[0] ?? "Invalid value"])
  ) as PropertyActionState["fieldErrors"];
}

function toPropertyPayload(
  values: PropertyFormValues,
  userId: string
): Database["public"]["Tables"]["properties"]["Insert"] {
  return {
    user_id: userId,
    title: values.title,
    type: values.type,
    intent: values.intent,
    status: values.status,
    location: values.location,
    address: values.address || null,
    price: values.price,
    bedrooms: values.bedrooms,
    bathrooms: values.bathrooms,
    area_sqft: values.area_sqft,
    owner_name: values.owner_name || null,
    owner_phone: values.owner_phone || null,
    image_urls: values.image_urls,
    amenities: parseAmenities(values.amenities_text),
    notes: values.notes || null
  };
}

export async function savePropertyAction(values: PropertyFormValues): Promise<PropertyActionState> {
  const parsed = propertyFormSchema.safeParse(values);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please fix the highlighted fields.",
      fieldErrors: toFieldErrors(parsed.error)
    };
  }

  if (!hasSupabaseEnv()) {
    return { ok: false, message: "Supabase is not configured yet. Add env variables before saving properties." };
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  await ensureDbUser(supabase, user);

  const payload = toPropertyPayload(parsed.data, user.id);
  const query = parsed.data.id
    ? supabase.from("properties").update(payload as never).eq("id", parsed.data.id).eq("user_id", user.id)
    : supabase.from("properties").insert(payload as never);

  const { error } = await query;
  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/properties");
  return { ok: true, message: parsed.data.id ? "Property updated." : "Property added." };
}

export async function deletePropertyAction(propertyId: string): Promise<PropertyActionState> {
  if (!hasSupabaseEnv()) {
    return { ok: false, message: "Supabase is not configured yet. Add env variables before deleting properties." };
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const { error } = await supabase.from("properties").delete().eq("id", propertyId).eq("user_id", user.id);
  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/properties");
  return { ok: true, message: "Property deleted." };
}
