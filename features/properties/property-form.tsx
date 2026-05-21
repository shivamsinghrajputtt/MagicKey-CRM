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
  propertyBhkOptions,
  propertyIntents,
  propertyStatuses,
  propertyTypes
} from "@/features/properties/constants";
import { PropertyImageUploader } from "@/features/properties/property-image-uploader";
import { propertyFormSchema, type PropertyFormValues } from "@/features/properties/schema";
import type { Property } from "@/lib/types";

type PropertyFormProps = {
  property?: Property | null;
  isPending: boolean;
  onCancel: () => void;
  onSubmit: (values: PropertyFormValues) => void;
};

const defaultValues: PropertyFormValues = {
  title: "",
  type: "apartment",
  intent: "rent",
  status: "available",
  location: "",
  address: "",
  price: 0,
  bedrooms: null,
  bathrooms: null,
  area_sqft: null,
  owner_name: "",
  owner_phone: "",
  amenities_text: "",
  notes: "",
  image_urls: []
};

function toDefaults(property?: Property | null): PropertyFormValues {
  if (!property) return defaultValues;

  return {
    id: property.id,
    title: property.title,
    type: property.type,
    intent: property.intent,
    status: property.status,
    location: property.location,
    address: property.address ?? "",
    price: property.price,
    bedrooms: property.bedrooms ?? null,
    bathrooms: property.bathrooms ?? null,
    area_sqft: property.area_sqft ?? null,
    owner_name: property.owner_name ?? "",
    owner_phone: property.owner_phone ?? "",
    amenities_text: property.amenities?.join(", ") ?? "",
    notes: property.notes ?? "",
    image_urls: property.image_urls ?? []
  };
}

export function PropertyForm({ property, isPending, onCancel, onSubmit }: PropertyFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: toDefaults(property)
  });

  const values = watch();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Field label="Property title" error={errors.title?.message}>
        <Input placeholder="Sea-facing 2 BHK Residence" {...register("title")} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Type" error={errors.type?.message}>
          <Select
            value={values.type}
            onValueChange={(value: PropertyFormValues["type"]) => setValue("type", value, { shouldValidate: true })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {propertyTypes.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Rent / Buy" error={errors.intent?.message}>
          <Select
            value={values.intent}
            onValueChange={(value: PropertyFormValues["intent"]) => setValue("intent", value, { shouldValidate: true })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {propertyIntents.map((option) => (
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
            onValueChange={(value: PropertyFormValues["status"]) => setValue("status", value, { shouldValidate: true })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {propertyStatuses.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Location" error={errors.location?.message}>
          <Input placeholder="Bandra West" {...register("location")} />
        </Field>
        <Field label="Price" error={errors.price?.message}>
          <Input inputMode="numeric" placeholder="85000" {...register("price")} />
        </Field>
      </div>

      <Field label="Address" error={errors.address?.message}>
        <Input placeholder="Carter Road, near promenade" {...register("address")} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="BHK" error={errors.bedrooms?.message}>
          <Select
            value={values.bedrooms === null ? "none" : String(values.bedrooms)}
            onValueChange={(value) =>
              setValue("bedrooms", value === "none" ? null : Number(value), { shouldValidate: true })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Not applicable</SelectItem>
              {propertyBhkOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option} BHK
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Bathrooms" error={errors.bathrooms?.message}>
          <Input inputMode="numeric" placeholder="2" {...register("bathrooms")} />
        </Field>
        <Field label="Area sqft" error={errors.area_sqft?.message}>
          <Input inputMode="numeric" placeholder="920" {...register("area_sqft")} />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Owner name" error={errors.owner_name?.message}>
          <Input placeholder="N. Kapoor" {...register("owner_name")} />
        </Field>
        <Field label="Owner phone" error={errors.owner_phone?.message}>
          <Input inputMode="tel" placeholder="+91 98200 01111" {...register("owner_phone")} />
        </Field>
      </div>

      <Field label="Amenities" error={errors.amenities_text?.message}>
        <Input placeholder="Parking, Sea view, Pet friendly" {...register("amenities_text")} />
      </Field>

      <Field label="Notes" error={errors.notes?.message}>
        <Textarea placeholder="Availability, negotiation room, key details" {...register("notes")} />
      </Field>

      <Field label="Images" error={errors.image_urls?.message}>
        <PropertyImageUploader
          imageUrls={values.image_urls}
          onChange={(urls) => setValue("image_urls", urls, { shouldValidate: true, shouldDirty: true })}
        />
      </Field>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
          Cancel
        </Button>
        <Button type="submit" variant="gold" disabled={isPending}>
          {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
          {property ? "Update property" : "Add property"}
        </Button>
      </DialogFooter>
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {error ? <p className="text-xs font-medium text-destructive">{error}</p> : null}
    </div>
  );
}
