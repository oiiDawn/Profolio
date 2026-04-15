/**
 * 一键上传 MDX 到 Supabase Storage，并写入/更新 `writing_shares`。
 * 主键 `id` 为 UUID；新建文章可不写 frontmatter 的 `id`，由数据库生成。
 *
 * 需要环境变量（放在 `.env.local`）：
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY   （仅本地脚本使用，勿提交、勿暴露到前端）
 *
 * 用法：
 *   pnpm upload-writing ./path/to/article.mdx
 *   pnpm upload-writing ./article.mdx --id <已有行的UUID>   # 更新该条
 *   pnpm upload-writing --link --url https://example.com --title 标题 [--id <uuid>]
 */

import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";
import { pathToFileURL } from "node:url";
import { config as loadEnv } from "dotenv";
import matter from "gray-matter";
import { existsSync, readFileSync } from "fs";
import path from "path";

import {
  writingFrontmatterSchema,
  writingLinkInputSchema,
} from "@/lib/types";

function loadEnvironment() {
  loadEnv({ path: ".env.local" });
  loadEnv({ path: ".env" });
}

export type ParsedArgs = ReturnType<typeof parseArgs>;
type FileUploadInput = {
  description: string | null;
  explicitUuid: string | null;
  storagePath: string;
  tag: string | null;
  title: string;
  uploadSource: string;
};

export function parseArgs(argv: string[]) {
  const positional: string[] = [];
  const flags: Record<string, string | boolean> = {};

  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) {
      positional.push(a);
      continue;
    }
    const key = a.slice(2);
    const next = argv[i + 1];
    if (next !== undefined && !next.startsWith("--")) {
      flags[key] = next;
      i++;
    } else {
      flags[key] = true;
    }
  }
  return { positional, flags };
}

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) {
    console.error(`缺少环境变量 ${name}（请在 .env.local 中配置）`);
    process.exit(1);
  }
  return v;
}

/** 宽松校验 UUID（含非 RFC 变体时仍放行常见 Postgres uuid 文本） */
export function isUuid(s: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    s.trim(),
  );
}

function getOptionalFlagString(value: string | boolean | undefined): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

export function parseLinkRowInput(flags: ParsedArgs["flags"]) {
  const result = writingLinkInputSchema.safeParse({
    id: getOptionalFlagString(flags.id),
    title: String(flags.title ?? ""),
    description: getOptionalFlagString(flags.description) ?? null,
    tag: getOptionalFlagString(flags.tag) ?? null,
    url: String(flags.url ?? ""),
  });

  if (!result.success) {
    throw new Error(
      result.error.flatten().formErrors[0] ??
        "外链模式需要: --link --url <https://...> --title <标题> [--description] [--tag] [--id <uuid>]",
    );
  }

  return {
    description: result.data.description,
    id: result.data.id ?? randomUUID(),
    tag: result.data.tag,
    title: result.data.title,
    url: result.data.url,
  };
}

export function parseFileUploadInput(
  abs: string,
  flags: ParsedArgs["flags"],
  raw: string,
): FileUploadInput {
  const parsed = matter(raw);
  const frontmatter = writingFrontmatterSchema.safeParse(parsed.data);

  if (!frontmatter.success) {
    throw new Error(
      frontmatter.error.flatten().formErrors[0] ?? "frontmatter 格式无效",
    );
  }

  const fm = frontmatter.data;
  const basename = path.basename(abs);
  const filePathFromFlag = getOptionalFlagString(flags["file-path"]);
  const storagePath = fm.file_path ?? filePathFromFlag ?? basename;

  const flagId = getOptionalFlagString(flags.id);
  const explicitUuid = flagId ?? fm.id ?? null;

  const title =
    getOptionalFlagString(flags.title) ??
    fm.title?.trim() ??
    path.basename(abs, path.extname(abs));

  const description = getOptionalFlagString(flags.description) ?? fm.description ?? null;
  const tag = getOptionalFlagString(flags.tag) ?? fm.tag ?? null;

  const uploadSource =
    typeof flags["strip-frontmatter"] === "string" ||
    flags["strip-frontmatter"] === true
      ? parsed.content.trimStart()
      : raw;

  return {
    description,
    explicitUuid,
    storagePath,
    tag,
    title,
    uploadSource,
  };
}

export async function main(argv: string[] = process.argv) {
  loadEnvironment();

  const { positional, flags } = parseArgs(argv);
  const dryRun = Boolean(flags["dry-run"]);
  const isLink = Boolean(flags.link);

  const url = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  if (isLink) {
    let parsedLink;
    try {
      parsedLink = parseLinkRowInput(flags);
    } catch (error) {
      console.error(
        error instanceof Error
          ? error.message
          : "外链模式需要: --link --url <https://...> --title <标题> [--description] [--tag] [--id <uuid>]",
      );
      process.exit(1);
    }

    const row = {
      id: parsedLink.id,
      title: parsedLink.title,
      description: parsedLink.description,
      tag: parsedLink.tag,
      type: "link" as const,
      url: parsedLink.url,
      file_path: null as string | null,
    };

    if (dryRun) {
      console.log("[dry-run] upsert writing_shares:", row);
      return;
    }

    const { data: existing } = await supabase
      .from("writing_shares")
      .select("id")
      .eq("id", row.id)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from("writing_shares")
        .update({
          title: row.title,
          description: row.description,
          tag: row.tag,
          type: row.type,
          url: row.url,
          file_path: row.file_path,
        })
        .eq("id", row.id);
      if (error) {
        console.error("更新失败:", error.message);
        process.exit(1);
      }
    } else {
      const { error } = await supabase.from("writing_shares").insert({
        ...row,
        created_at: new Date().toISOString(),
      });
      if (error) {
        console.error("插入失败:", error.message);
        process.exit(1);
      }
    }
    console.log(`已保存外链条目: ${row.id} → ${row.url}`);
    return;
  }

  const fileArg = positional[0];
  if (!fileArg) {
    console.error(
      "用法: pnpm upload-writing <文件.mdx> [--id <uuid>] 或 pnpm upload-writing --link ...",
    );
    process.exit(1);
  }

  const abs = path.resolve(process.cwd(), fileArg);
  if (!existsSync(abs)) {
    console.error(`文件不存在: ${abs}`);
    process.exit(1);
  }

  const raw = readFileSync(abs, "utf8");

  let parsedFile;
  try {
    parsedFile = parseFileUploadInput(abs, flags, raw);
  } catch (error) {
    console.error(error instanceof Error ? error.message : "frontmatter 格式无效");
    process.exit(1);
  }

  if (parsedFile.explicitUuid && !isUuid(parsedFile.explicitUuid)) {
    console.error(
      "id 必须为 UUID。新建文章请删除 frontmatter 中的 id 或 --id，上传后会打印新 id。",
    );
    process.exit(1);
  }

  if (dryRun) {
    console.log("[dry-run] Storage path:", parsedFile.storagePath);
    console.log(
      "[dry-run] mode:",
      parsedFile.explicitUuid
        ? `update ${parsedFile.explicitUuid}`
        : "insert (new uuid)",
    );
    console.log("[dry-run] writing_shares row:", {
      id: parsedFile.explicitUuid ?? "(generated)",
      title: parsedFile.title,
      description: parsedFile.description,
      tag: parsedFile.tag,
      type: "md",
      file_path: parsedFile.storagePath,
    });
    console.log(
      "[dry-run] upload bytes:",
      Buffer.byteLength(parsedFile.uploadSource, "utf8"),
    );
    return;
  }

  const { error: upErr } = await supabase.storage
    .from("writing")
    .upload(parsedFile.storagePath, parsedFile.uploadSource, {
      upsert: true,
      contentType: "text/plain; charset=utf-8",
      cacheControl: "3600",
    });

  if (upErr) {
    console.error("Storage 上传失败:", upErr.message);
    process.exit(1);
  }

  const payload = {
    title: parsedFile.title,
    description: parsedFile.description,
    tag: parsedFile.tag,
    type: "md" as const,
    url: null as string | null,
    file_path: parsedFile.storagePath,
  };

  if (parsedFile.explicitUuid) {
    const { error } = await supabase
      .from("writing_shares")
      .update(payload)
      .eq("id", parsedFile.explicitUuid);
    if (error) {
      console.error("writing_shares 更新失败:", error.message);
      process.exit(1);
    }
    console.log(
      `完成: id=${parsedFile.explicitUuid} file_path=${parsedFile.storagePath}（Storage 已 upsert，数据库已更新）`,
    );
    return;
  }

  const { data: inserted, error: insErr } = await supabase
    .from("writing_shares")
    .insert({
      ...payload,
      created_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (insErr || !inserted?.id) {
    console.error("writing_shares 插入失败:", insErr?.message);
    process.exit(1);
  }

  console.log(
    `完成: id=${inserted.id} file_path=${parsedFile.storagePath}（新建行；可把此 id 写入 frontmatter 的 id 以便下次覆盖）`,
  );
}

function isDirectExecution() {
  const entry = process.argv[1];
  if (!entry) {
    return false;
  }

  return import.meta.url === pathToFileURL(entry).href;
}

if (isDirectExecution()) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
