import { z } from "zod";

export const createFolderSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional().default("#4F46E5"),
  icon: z.string().max(10).optional().nullable(),
  description: z.string().max(300).optional().nullable(),
  sortOrder: z.number().int().min(0).optional().default(0),
});

export const updateFolderSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  icon: z.string().max(10).nullable().optional(),
  description: z.string().max(300).nullable().optional(),
  sortOrder: z.number().int().min(0).optional(),
});

export const reorderFoldersSchema = z.object({
  folders: z.array(z.object({
    id: z.string().min(1),
    sortOrder: z.number().int().min(0),
  })).min(1),
});