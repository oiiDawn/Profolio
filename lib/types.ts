import { z } from "zod";

/** Writing / shares metadata (Supabase `writing_shares`) */

type UnknownInput = unknown;

/** 将 unknown 输入统一转为 string | null/undefined，number 自动转字符串 */
function preprocessString(emptyAs: null | undefined, trim: boolean) {
  return z.preprocess((value: UnknownInput) => {
    if (value === undefined || value === null || value === "") {
      return emptyAs;
    }
    if (typeof value === "string") {
      return trim ? value.trim() : value;
    }
    if (typeof value === "number") {
      return String(value);
    }
    return value;
  }, emptyAs === null ? z.string().nullable() : z.string().optional());
}

const nullableString = preprocessString(null, false);
const nullableTrimmedString = preprocessString(null, true);
const optionalString = preprocessString(undefined, false);

const uuidString = z.uuid();
const nonEmptyTrimmedString = z.string().trim().min(1);

const normalizedWritingType = z
  .union([z.literal("link"), z.literal("md"), z.string()])
  .transform((value: string) => (value === "link" ? "link" : "md"));

export const writingShareRowSchema = z.object({
  id: uuidString,
  title: nonEmptyTrimmedString,
  description: nullableTrimmedString,
  tag: nullableTrimmedString,
  type: normalizedWritingType,
  url: preprocessString(null, true).pipe(z.url().nullable()),
  file_path: nullableTrimmedString,
  created_at: nonEmptyTrimmedString,
}).superRefine((value, ctx) => {
  if (value.type === "md") {
    if (!value.file_path) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "md 类型必须提供 file_path",
        path: ["file_path"],
      });
    }
    if (value.url !== null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "md 类型不允许设置 url",
        path: ["url"],
      });
    }
    return;
  }

  if (!value.url) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "link 类型必须提供 url",
      path: ["url"],
    });
  }

  if (value.file_path !== null) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "link 类型不允许设置 file_path",
      path: ["file_path"],
    });
  }
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

export const writingFrontmatterSchema = z.object({
  id: optionalUuidString,
  title: optionalString,
  description: optionalString,
  tag: optionalString,
  file_path: optionalString,
});

export type WritingFrontmatter = z.infer<typeof writingFrontmatterSchema>;

export const writingLinkInputSchema = z.object({
  id: optionalUuidString,
  title: nonEmptyTrimmedString,
  description: nullableString,
  tag: nullableString,
  url: z.url(),
});

export type WritingLinkInput = z.infer<typeof writingLinkInputSchema>;
