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
import {
  bhkOptions,
  clientStatuses,
  clientTypes,
  furnishedTypes,
  requirementTypes
} from "@/features/clients/constants";
import { clientFormSchema, type ClientFormValues } from "@/features/clients/schema";
import type { Client } from "@/lib/types";

type ClientFormProps = {
  client?: Client | null;
  isPending: boolean;
  onCancel: () => void;
  onSubmit: (values: ClientFormValues) => void;
};

const defaultValues: ClientFormValues = {
  full_name: "",
  phone: "",
  type: "tenant",
  requirement_type: "rent",
  bhk: null,
  furnished_type: "semi_furnished",
  preferred_location: "",
  budget: null,
  notes: "",
  status: "lead"
};

function toDefaults(client?: Client | null): ClientFormValues {
  if (!client) return defaultValues;

  return {
    id: client.id,
    full_name: client.full_name,
    phone: client.phone,
    type: client.type,
    requirement_type: client.requirement_type ?? "rent",
    bhk: client.bhk ?? null,
    furnished_type: client.furnished_type ?? "semi_furnished",
    preferred_location: client.preferred_location ?? client.preferred_locations?.[0] ?? "",
    budget: client.budget ?? client.budget_max ?? client.budget_min ?? null,
    notes: client.notes ?? "",
    status: client.status
  };
}

export function ClientForm({ client, isPending, onCancel, onSubmit }: ClientFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: toDefaults(client)
  });

  const values = watch();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pb-6">
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <Field label="Name" error={errors.full_name?.message}>
          <Input placeholder="Riya Shah" {...register("full_name")} />
        </Field>
        <Field label="Phone" error={errors.phone?.message}>
          <Input inputMode="tel" placeholder="+91 98765 43210" {...register("phone")} />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <Field label="Requirement type" error={errors.requirement_type?.message}>
          <Select
            value={values.requirement_type}
            onValueChange={(value: ClientFormValues["requirement_type"]) =>
              setValue("requirement_type", value, { shouldValidate: true })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {requirementTypes.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Client type" error={errors.type?.message}>
          <Select
            value={values.type}
            onValueChange={(value: ClientFormValues["type"]) => setValue("type", value, { shouldValidate: true })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {clientTypes.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <Field label="BHK" error={errors.bhk?.message}>
          <Select
            value={values.bhk === null ? "none" : String(values.bhk)}
            onValueChange={(value) => setValue("bhk", value === "none" ? null : Number(value), { shouldValidate: true })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Any</SelectItem>
              {bhkOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option} BHK
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Furnished" error={errors.furnished_type?.message}>
          <Select
            value={values.furnished_type}
            onValueChange={(value: ClientFormValues["furnished_type"]) =>
              setValue("furnished_type", value, { shouldValidate: true })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {furnishedTypes.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Status" error={errors.status?.message}>
          <Select
            value={values.status}
            onValueChange={(value: ClientFormValues["status"]) => setValue("status", value, { shouldValidate: true })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {clientStatuses.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <Field label="Preferred location" error={errors.preferred_location?.message}>
          <Input placeholder="Bandra West" {...register("preferred_location")} />
        </Field>
        <Field label="Budget" error={errors.budget?.message}>
          <Input inputMode="numeric" placeholder="85000" {...register("budget")} />
        </Field>
      </div>

      <Field label="Notes" error={errors.notes?.message}>
        <Textarea placeholder="Timing, building preference, urgency, family details" {...register("notes")} />
      </Field>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
          Cancel
        </Button>
        <Button type="submit" variant="gold" disabled={isPending}>
          {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
          {client ? "Update client" : "Add client"}
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
    <div className="space-y-1.5 min-w-0">
      <Label className="text-xs sm:text-sm truncate block">{label}</Label>
      {children}
      {error ? <p className="text-[10px] sm:text-xs font-medium text-destructive mt-1 leading-none">{error}</p> : null}
    </div>
  );
}
