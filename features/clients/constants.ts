import type { ClientStatus, ClientType, FurnishedType, RequirementIntent } from "@/lib/types";

export const clientStatuses: { value: ClientStatus; label: string }[] = [
  { value: "lead", label: "Lead" },
  { value: "active", label: "Active" },
  { value: "hot", label: "Hot" },
  { value: "closed", label: "Closed" },
  { value: "lost", label: "Lost" }
];

export const clientTypes: { value: ClientType; label: string }[] = [
  { value: "tenant", label: "Tenant" },
  { value: "buyer", label: "Buyer" },
  { value: "owner", label: "Owner" },
  { value: "investor", label: "Investor" }
];

export const requirementTypes: { value: RequirementIntent; label: string }[] = [
  { value: "rent", label: "Rent" },
  { value: "buy", label: "Buy" }
];

export const furnishedTypes: { value: FurnishedType; label: string }[] = [
  { value: "unfurnished", label: "Unfurnished" },
  { value: "semi_furnished", label: "Semi furnished" },
  { value: "fully_furnished", label: "Fully furnished" }
];

export const bhkOptions = ["1", "2", "3", "4", "5"];

export function getOptionLabel<T extends string>(options: { value: T; label: string }[], value?: T | null) {
  return options.find((option) => option.value === value)?.label ?? value ?? "Not set";
}
