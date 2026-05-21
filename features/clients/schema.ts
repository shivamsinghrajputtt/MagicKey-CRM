import { z } from "zod";

const optionalNumber = z.preprocess(
  (value) => (value === "" || value === null || typeof value === "undefined" ? null : Number(value)),
  z.number().nonnegative("Must be 0 or more").nullable()
);

export const clientFormSchema = z.object({
  id: z.string().optional(),
  full_name: z.string().trim().min(2, "Name must be at least 2 characters"),
  phone: z
    .string()
    .trim()
    .min(8, "Enter a valid phone number")
    .regex(/^[+\d\s()-]+$/, "Use only numbers, spaces, +, - or brackets"),
  type: z.enum(["buyer", "tenant", "owner", "investor"]),
  requirement_type: z.enum(["rent", "buy"]),
  bhk: optionalNumber.refine((value) => value === null || Number.isInteger(value), "BHK must be a whole number"),
  furnished_type: z.enum(["unfurnished", "semi_furnished", "fully_furnished"]),
  preferred_location: z.string().trim().min(2, "Location is required"),
  budget: optionalNumber,
  notes: z.string().trim().max(800, "Notes must stay under 800 characters").optional(),
  status: z.enum(["lead", "active", "hot", "closed", "lost"])
});

export type ClientFormValues = z.infer<typeof clientFormSchema>;

export const clientFilterSchema = z.object({
  q: z.string().optional(),
  status: z.string().optional(),
  bhk: z.string().optional(),
  furnished_type: z.string().optional(),
  location: z.string().optional(),
  budget_min: z.string().optional(),
  budget_max: z.string().optional()
});

export type ClientFilters = z.infer<typeof clientFilterSchema>;
