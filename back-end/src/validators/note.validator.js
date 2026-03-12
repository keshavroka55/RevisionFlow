import { z } from "zod";

export const createNoteSchema = z.object({
  folderId: z.string().min(1, "Folder ID is required"),
  title: z.string().min(1, "Title is required").max(255),
  content: z.any().default({}),
  contentText: z.string().optional(),     // plain text for search
  tags: z.array(z.string()).default([]),
  isEmailEnabled: z.boolean().default(true),
});

export const updateNoteSchema = z.object({
  folderId: z.string().optional(),
  title: z.string().min(1).max(255).optional(),
  content: z.any().optional(),
  contentText: z.string().optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]).optional(),
  isEmailEnabled: z.boolean().optional(),
});

export const searchNoteSchema = z.object({
  q: z.string().optional(),
  folderId: z.string().optional(),
  tags: z.string().optional(),         // comma separated: "tag1,tag2"
  mastery: z.enum(["NEW", "IN_PROGRESS", "MASTERED"]).optional(),
  status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});