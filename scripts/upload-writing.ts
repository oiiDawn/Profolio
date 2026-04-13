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
import { config as loadEnv } from "dotenv";
import matter from "gray-matter";
import { existsSync, readFileSync } from "fs";
import path from "path";

loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

function parseArgs(argv: string[]) {
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
function isUuid(s: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    s.trim(),
  );
}

async function main() {
  const { positional, flags } = parseArgs(process.argv);
  const dryRun = Boolean(flags["dry-run"]);
  const isLink = Boolean(flags.link);

  const url = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  if (isLink) {
    const linkUrl = String(flags.url ?? "");
    const title = String(flags.title ?? "");
    if (!linkUrl || !title) {
      console.error(
        "外链模式需要: --link --url <https://...> --title <标题> [--description] [--tag] [--id <uuid>]",
      );
      process.exit(1);
    }
    const description =
      typeof flags.description === "string" ? flags.description : null;
    const tag = typeof flags.tag === "string" ? flags.tag : null;

    const idFlag =
      typeof flags.id === "string" && flags.id.trim() ? flags.id.trim() : null;
    if (idFlag && !isUuid(idFlag)) {
      console.error("--id 必须是 UUID");
      process.exit(1);
    }
    const id = idFlag ?? randomUUID();

    const row = {
      id,
      title,
      description,
      tag,
      type: "link" as const,
      url: linkUrl,
      file_path: null as string | null,
    };

    if (dryRun) {
      console.log("[dry-run] upsert writing_shares:", row);
      return;
    }

    const { data: existing } = await supabase
      .from("writing_shares")
      .select("id")
      .eq("id", id)
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
        .eq("id", id);
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
    console.log(`已保存外链条目: ${id} → ${linkUrl}`);
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
  const parsed = matter(raw);
  const fm = parsed.data as Record<string, unknown>;
  const bodyWithoutFm = parsed.content;

  const basename = path.basename(abs);
  const filePathFromFlag =
    typeof flags["file-path"] === "string" ? flags["file-path"] : undefined;

  const fmFilePath =
    typeof fm.file_path === "string"
      ? fm.file_path.trim()
      : typeof fm.file_path === "number"
        ? String(fm.file_path)
        : "";

  const storagePath = fmFilePath || filePathFromFlag || basename;

  const fmIdRaw =
    typeof fm.id === "string" || typeof fm.id === "number"
      ? String(fm.id).trim()
      : "";
  const flagId =
    typeof flags.id === "string" && flags.id.trim() ? flags.id.trim() : "";

  const explicitUuid =
    (flagId && isUuid(flagId) ? flagId : null) ||
    (fmIdRaw && isUuid(fmIdRaw) ? fmIdRaw : null);

  if ((flagId && !isUuid(flagId)) || (fmIdRaw && !isUuid(fmIdRaw))) {
    console.error(
      "id 必须为 UUID。新建文章请删除 frontmatter 中的 id 或 --id，上传后会打印新 id。",
    );
    process.exit(1);
  }

  const fmTitle =
    typeof fm.title === "string"
      ? fm.title.trim()
      : typeof fm.title === "number"
        ? String(fm.title)
        : "";

  const title =
    (typeof flags.title === "string" && flags.title) ||
    fmTitle ||
    path.basename(abs, path.extname(abs));

  const description =
    (typeof flags.description === "string" && flags.description) ||
    (typeof fm.description === "string"
      ? fm.description
      : typeof fm.description === "number"
        ? String(fm.description)
        : null) ||
    null;

  const tag =
    (typeof flags.tag === "string" && flags.tag) ||
    (typeof fm.tag === "string"
      ? fm.tag
      : typeof fm.tag === "number"
        ? String(fm.tag)
        : null) ||
    null;

  const uploadSource =
    typeof flags["strip-frontmatter"] === "string" ||
    flags["strip-frontmatter"] === true
      ? bodyWithoutFm.trimStart()
      : raw;

  if (dryRun) {
    console.log("[dry-run] Storage path:", storagePath);
    console.log(
      "[dry-run] mode:",
      explicitUuid ? `update ${explicitUuid}` : "insert (new uuid)",
    );
    console.log("[dry-run] writing_shares row:", {
      id: explicitUuid ?? "(generated)",
      title,
      description,
      tag,
      type: "md",
      file_path: storagePath,
    });
    console.log(
      "[dry-run] upload bytes:",
      Buffer.byteLength(uploadSource, "utf8"),
    );
    return;
  }

  const { error: upErr } = await supabase.storage
    .from("writing")
    .upload(storagePath, uploadSource, {
      upsert: true,
      contentType: "text/plain; charset=utf-8",
      cacheControl: "3600",
    });

  if (upErr) {
    console.error("Storage 上传失败:", upErr.message);
    process.exit(1);
  }

  const payload = {
    title,
    description,
    tag,
    type: "md" as const,
    url: null as string | null,
    file_path: storagePath,
  };

  if (explicitUuid) {
    const { error } = await supabase
      .from("writing_shares")
      .update(payload)
      .eq("id", explicitUuid);
    if (error) {
      console.error("writing_shares 更新失败:", error.message);
      process.exit(1);
    }
    console.log(
      `完成: id=${explicitUuid} file_path=${storagePath}（Storage 已 upsert，数据库已更新）`,
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
    `完成: id=${inserted.id} file_path=${storagePath}（新建行；可把此 id 写入 frontmatter 的 id 以便下次覆盖）`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
