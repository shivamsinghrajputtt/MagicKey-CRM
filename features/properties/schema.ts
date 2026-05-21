import { z } from "zod";

const optionalNumber = z.preprocess(
  (value) => (value === "" || value === null || typeof value === "undefined" ? null : Number(value)),
  z.number().nonnegative("Must be 0 or more").nullable()
);

const requiredNumber = z.preprocess(
  (value) => (value === "" || value === null || typeof value === "undefined" ? NaN : Number(value)),
  z.number({ invalid_type_error: "Enter a valid number" }).nonnegative("Must be 0 or more")
);

export const propertyFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(3, "Title must be at least 3 characters"),
  type: z.enum(["apartment", "villa", "office", "shop", "plot", "warehouse"]),
  intent: z.enum(["rent", "buy"]),
  status: z.enum(["available", "reserved", "leased", "sold"]),
  location: z.string().trim().min(2, "Location is required"),
  address: z.string().trim().optional(),
  price: requiredNumber,
  bedrooms: optionalNumber.refine((value) => value === null || Number.isInteger(value), "BHK must be a whole number"),
  bathrooms: optionalNumber.refine((value) => value === null || Number.isInteger(value), "Bathrooms must be a whole number"),
  area_sqft: optionalNumber.refine((value) => value === null || Number.isInteger(value), "Area must be a whole number"),
  owner_name: z.string().trim().optional(),
  owner_phone: z
    .string()
    .trim()
    .regex(/^[+\d\s()-]*$/, "Use only numbers, spaces, +, - or brackets")
    .optional(),
  amenities_text: z.string().trim().optional(),
  notes: z.string().trim().max(900, "Notes must stay under 900 characters").optional(),
  image_urls: z.array(z.string().url()).default([])
});

export type PropertyFormValues = z.infer<typeof propertyFormSchema>;

export const propertyFilterSchema = z.object({
  q: z.string().optional(),
  status: z.string().optional(),
  type: z.string().optional(),
  intent: z.string().optional(),
  bhk: z.string().optional(),
  location: z.string().optional(),
  price_min: z.string().optional(),
  price_max: z.string().optional()
});

export type PropertyFilters = z.infer<typeof propertyFilterSchema>;

export function parseAmenities(value?: string) {
  return (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}
