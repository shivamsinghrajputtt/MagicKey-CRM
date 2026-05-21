import type { PropertyStatus, PropertyType, RequirementIntent } from "@/lib/types";

export const propertyTypes: { value: PropertyType; label: string }[] = [
  { value: "apartment", label: "Apartment" },
  { value: "villa", label: "Villa" },
  { value: "office", label: "Office" },
  { value: "shop", label: "Shop" },
  { value: "plot", label: "Plot" },
  { value: "warehouse", label: "Warehouse" }
];

export const propertyStatuses: { value: PropertyStatus; label: string }[] = [
  { value: "available", label: "Available" },
  { value: "reserved", label: "Reserved" },
  { value: "leased", label: "Leased" },
  { value: "sold", label: "Sold" }
];

export const propertyIntents: { value: RequirementIntent; label: string }[] = [
  { value: "rent", label: "Rent" },
  { value: "buy", label: "Buy" }
];

export const propertyBhkOptions = ["1", "2", "3", "4", "5"];

export function getPropertyOptionLabel<T extends string>(
  options: { value: T; label: string }[],
  value?: T | null
) {
  return options.find((option) => option.value === value)?.label ?? value ?? "Not set";
}
