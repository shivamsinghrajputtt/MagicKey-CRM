"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ZodError } from "zod";

import { hasSupabaseEnv } from "@/lib/env";
import { createClient, ensureDbUser } from "@/lib/supabase/server";
import { clientFormSchema, type ClientFormValues } from "@/features/clients/schema";
import type { Database } from "@/lib/supabase/database.types";

export type ClientActionState = {
  ok: boolean;
  message: string;
  fieldErrors?: Partial<Record<keyof ClientFormValues, string>>;
};

function toFieldErrors(error: ZodError<ClientFormValues>) {
  const flattened = error.flatten().fieldErrors;
  return Object.fromEntries(
    Object.entries(flattened).map(([key, value]) => [key, value?.[0] ?? "Invalid value"])
  ) as ClientActionState["fieldErrors"];
}

function toClientPayload(values: ClientFormValues, userId: string): Database["public"]["Tables"]["clients"]["Insert"] {
  const budget = values.budget ?? null;
  const preferredLocations = values.preferred_location ? [values.preferred_location] : [];

  return {
    user_id: userId,
    full_name: values.full_name,
    phone: values.phone,
    email: null,
    type: values.type,
    requirement_type: values.requirement_type,
    bhk: values.bhk,
    furnished_type: values.furnished_type,
    preferred_location: values.preferred_location,
    preferred_locations: preferredLocations,
    budget,
    budget_min: budget,
    budget_max: budget,
    notes: values.notes || null,
    status: values.status
  };
}

export async function saveClientAction(values: ClientFormValues): Promise<ClientActionState> {
  const parsed = clientFormSchema.safeParse(values);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please fix the highlighted fields.",
      fieldErrors: toFieldErrors(parsed.error)
    };
  }

  if (!hasSupabaseEnv()) {
    return { ok: false, message: "Supabase is not configured yet. Add env variables before saving clients." };
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

  const payload = toClientPayload(parsed.data, user.id);
  const query = parsed.data.id
    ? supabase.from("clients").update(payload as never).eq("id", parsed.data.id).eq("user_id", user.id)
    : supabase.from("clients").insert(payload as never);

  const { error } = await query;
  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/clients");
  return { ok: true, message: parsed.data.id ? "Client updated." : "Client added." };
}

export async function deleteClientAction(clientId: string): Promise<ClientActionState> {
  if (!hasSupabaseEnv()) {
    return { ok: false, message: "Supabase is not configured yet. Add env variables before deleting clients." };
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const { error } = await supabase.from("clients").delete().eq("id", clientId).eq("user_id", user.id);
  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/clients");
  return { ok: true, message: "Client deleted." };
}
