import { z } from "zod";

/** Writing / shares metadata (Supabase `writing_shares`) */

type UnknownInput = unknown;

const nullableStringFromUnknown = z.preprocess((value: UnknownInput) => {
  if (value === undefined || value === null || value === "") {
    return null;
  }
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number") {
    return String(value);
  }
  return value;
}, z.string().nullable());

const uuidString = z.uuid();

const nonEmptyTrimmedString = z.string().trim().min(1);

const normalizedWritingType = z
  .union([z.literal("link"), z.literal("md"), z.string()])
  .transform((value: string) => (value === "link" ? "link" : "md"));

export const writingShareRowSchema = z.object({
  id: uuidString,
  title: nonEmptyTrimmedString,
  description: nullableStringFromUnknown,
  tag: nullableStringFromUnknown,
  type: normalizedWritingType,
  url: nullableStringFromUnknown,
  file_path: nullableStringFromUnknown,
  created_at: nonEmptyTrimmedString,
  updated_at: nullableStringFromUnknown,
});

export const writingShareSchema = writingShareRowSchema;

export type WritingShare = z.infer<typeof writingShareSchema>;

const optionalUuidString = z.preprocess((value: UnknownInput) => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }
  if (typeof value === "string") {
    return value.trim();
  }
  if (typeof value === "number") {
    return String(value);
  }
  return value;
}, uuidString.optional());

const optionalStringFromUnknown = z.preprocess((value: UnknownInput) => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number") {
    return String(value);
  }
  return value;
}, z.string().optional());

export const writingFrontmatterSchema = z.object({
  id: optionalUuidString,
  title: optionalStringFromUnknown,
  description: optionalStringFromUnknown,
  tag: optionalStringFromUnknown,
  file_path: optionalStringFromUnknown,
});

export type WritingFrontmatter = z.infer<typeof writingFrontmatterSchema>;

export const writingLinkInputSchema = z.object({
  id: optionalUuidString,
  title: nonEmptyTrimmedString,
  description: nullableStringFromUnknown,
  tag: nullableStringFromUnknown,
  url: z.url(),
});

export type WritingLinkInput = z.infer<typeof writingLinkInputSchema>;
