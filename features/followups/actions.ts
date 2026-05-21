"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ZodError } from "zod";

import { hasSupabaseEnv } from "@/lib/env";
import { createClient, ensureDbUser } from "@/lib/supabase/server";
import { followupFormSchema, type FollowupFormValues } from "@/features/followups/schema";
import type { Database } from "@/lib/supabase/database.types";

export type FollowupActionState = {
  ok: boolean;
  message: string;
  fieldErrors?: Partial<Record<keyof FollowupFormValues, string>>;
};

function toFieldErrors(error: ZodError<FollowupFormValues>) {
  const flattened = error.flatten().fieldErrors;
  return Object.fromEntries(
    Object.entries(flattened).map(([key, value]) => [key, value?.[0] ?? "Invalid value"])
  ) as FollowupActionState["fieldErrors"];
}

function toFollowupPayload(
  values: FollowupFormValues,
  userId: string
 ): Database["public"]["Tables"]["followups"]["Insert"] {
  return {
    user_id: userId,
    client_id: values.client_id || null,
    property_id: values.property_id || null,
    title: values.title,
    due_at: values.due_at,
    status: values.status,
    notes: values.notes || null
  };
}

export async function saveFollowupAction(values: FollowupFormValues): Promise<FollowupActionState> {
  const parsed = followupFormSchema.safeParse(values);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please fix the highlighted fields.",
      fieldErrors: toFieldErrors(parsed.error)
    };
  }

  if (!hasSupabaseEnv()) {
    return { ok: false, message: "Supabase is not configured yet. Add env variables before saving follow-ups." };
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

  const payload = toFollowupPayload(parsed.data, user.id);
  const query = parsed.data.id
    ? supabase.from("followups").update(payload as never).eq("id", parsed.data.id).eq("user_id", user.id)
    : supabase.from("followups").insert(payload as never);

  const { error } = await query;
  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/followups");
  revalidatePath("/");
  return { ok: true, message: parsed.data.id ? "Follow-up updated." : "Follow-up added." };
}

export async function deleteFollowupAction(followupId: string): Promise<FollowupActionState> {
  if (!hasSupabaseEnv()) {
    return { ok: false, message: "Supabase is not configured yet. Add env variables before deleting follow-ups." };
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const { error } = await supabase.from("followups").delete().eq("id", followupId).eq("user_id", user.id);
  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/followups");
  revalidatePath("/");
  return { ok: true, message: "Follow-up deleted." };
}

export async function toggleFollowupStatusAction(
  followupId: string,
  status: "pending" | "done" | "missed"
): Promise<FollowupActionState> {
  if (!hasSupabaseEnv()) {
    return { ok: false, message: "Supabase is not configured yet. Add env variables to update follow-ups." };
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

  const { error } = await supabase
    .from("followups")
    .update({ status } as never)
    .eq("id", followupId)
    .eq("user_id", user.id);

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/followups");
  revalidatePath("/");
  return { ok: true, message: `Follow-up marked as ${status}.` };
}
