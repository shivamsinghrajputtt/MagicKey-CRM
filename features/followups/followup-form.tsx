"use client";

import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { followupFormSchema, type FollowupFormValues } from "@/features/followups/schema";
import type { Client, Property, Followup } from "@/lib/types";

type FollowupFormProps = {
  followup?: Followup | null;
  clients: Client[];
  properties: Property[];
  isPending: boolean;
  onCancel: () => void;
  onSubmit: (values: FollowupFormValues) => void;
};

function toDatetimeLocal(isoString?: string | null) {
  if (!isoString) {
    // Default to 1 hour from now
    const d = new Date();
    d.setHours(d.getHours() + 1);
    d.setMinutes(0);
    return formatDateForInput(d);
  }
  return formatDateForInput(new Date(isoString));
}

function formatDateForInput(d: Date) {
  if (isNaN(d.getTime())) return "";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function FollowupForm({
  followup,
  clients,
  properties,
  isPending,
  onCancel,
  onSubmit
}: FollowupFormProps) {
  const defaultValues: FollowupFormValues = {
    title: "",
    client_id: null,
    property_id: null,
    due_at: toDatetimeLocal(null),
    status: "pending",
    notes: ""
  };

  function toDefaults(f?: Followup | null): FollowupFormValues {
    if (!f) return defaultValues;
    return {
      id: f.id,
      title: f.title,
      client_id: f.client_id ?? null,
      property_id: f.property_id ?? null,
      due_at: toDatetimeLocal(f.due_at),
      status: f.status,
      notes: f.notes ?? ""
    };
  }

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<FollowupFormValues>({
    resolver: zodResolver(followupFormSchema),
    defaultValues: toDefaults(followup)
  });

  const values = watch();

  function onFormSubmit(formValues: FollowupFormValues) {
    // Convert the local datetime-local value to ISO string
    const isoDueAt = new Date(formValues.due_at).toISOString();
    onSubmit({
      ...formValues,
      due_at: isoDueAt
    });
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <Field label="Task Title" error={errors.title?.message}>
        <Input placeholder="Call client to discuss Bandra property" {...register("title")} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Link Client (Optional)" error={errors.client_id?.message}>
          <Select
            value={values.client_id || "none"}
            onValueChange={(value) =>
              setValue("client_id", value === "none" ? null : value, { shouldValidate: true })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a client" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {clients.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.full_name} ({c.phone})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Link Property (Optional)" error={errors.property_id?.message}>
          <Select
            value={values.property_id || "none"}
            onValueChange={(value) =>
              setValue("property_id", value === "none" ? null : value, { shouldValidate: true })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a property" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {properties.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Due Date & Time" error={errors.due_at?.message}>
          <Input type="datetime-local" {...register("due_at")} />
        </Field>

        <Field label="Status" error={errors.status?.message}>
          <Select
            value={values.status}
            onValueChange={(value: FollowupFormValues["status"]) =>
              setValue("status", value, { shouldValidate: true })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="done">Completed</SelectItem>
              <SelectItem value="missed">Missed</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </div>

      <Field label="Notes" error={errors.notes?.message}>
        <Textarea
          placeholder="Enter details of what needs to be discussed, specific requests etc."
          rows={3}
          {...register("notes")}
        />
      </Field>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
          Cancel
        </Button>
        <Button type="submit" variant="gold" disabled={isPending}>
          {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
          {followup ? "Update Follow-up" : "Add Follow-up"}
        </Button>
      </DialogFooter>
    </form>
  );
}

function Field({
  label,
  error,
  children
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {error ? <p className="text-xs font-medium text-destructive">{error}</p> : null}
    </div>
  );
}
