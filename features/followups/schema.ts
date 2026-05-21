import { z } from "zod";

export const followupFormSchema = z.object({
  id: z.string().optional(),
  client_id: z.string().uuid("Invalid client ID").nullable().optional(),
  property_id: z.string().uuid("Invalid property ID").nullable().optional(),
  title: z.string().trim().min(2, "Title must be at least 2 characters"),
  due_at: z.string().min(1, "Due date and time is required"),
  status: z.enum(["pending", "done", "missed"]),
  notes: z.string().trim().max(800, "Notes must stay under 800 characters").optional().nullable()
});

export type FollowupFormValues = z.infer<typeof followupFormSchema>;

export const followupFilterSchema = z.object({
  q: z.string().optional(),
  status: z.string().optional(), // "pending" | "done" | "missed" | "all"
  client_id: z.string().optional(),
  property_id: z.string().optional()
});

export type FollowupFilters = z.infer<typeof followupFilterSchema>;
