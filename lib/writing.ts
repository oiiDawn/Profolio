import { unstable_cache } from "next/cache";
import { cache } from "react";

import { createSupabaseServerClient } from "@/lib/supabase";
import type { WritingShare } from "@/lib/types";

function mapRow(row: {
  id: string;
  title: string;
  description: string | null;
  tag: string | null;
  type: string;
  url: string | null;
  file_path: string | null;
  created_at: string;
  updated_at: string | null;
}): WritingShare {
  const t = row.type === "link" ? "link" : "md";
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    tag: row.tag,
    type: t,
    url: row.url,
    file_path: row.file_path,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

async function getSharesUncached(): Promise<WritingShare[]> {
  const supabase = createSupabaseServerClient();
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("writing_shares")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[writing] writing_shares:", error.message);
    return [];
  }
  if (!data?.length) {
    return [];
  }

  return data.map((row) => mapRow(row as Parameters<typeof mapRow>[0]));
}

async function getShareByIdUncached(id: string): Promise<WritingShare | null> {
  const supabase = createSupabaseServerClient();
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("writing_shares")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("[writing] getShareById:", error.message);
    return null;
  }

  if (!data) {
    return null;
  }

  return mapRow(data as Parameters<typeof mapRow>[0]);
}

/**
 * Raw MDX source from Storage bucket `writing`, or null if missing / misconfigured.
 */
async function getShareMdxContentUncached(
  filePath: string,
): Promise<string | null> {
  const supabase = createSupabaseServerClient();
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase.storage
    .from("writing")
    .download(filePath);

  if (error || !data) {
    if (error) {
      console.error("[writing] storage download:", error.message);
    }
    return null;
  }

  try {
    return await data.text();
  } catch (e) {
    console.error("[writing] storage text:", e);
    return null;
  }
}

const getSharesCached = unstable_cache(getSharesUncached, ["writing-shares"], {
  revalidate: 300,
  tags: ["writing-shares"],
});

const getShareByIdCached = cache(async (id: string) => getShareByIdUncached(id));

const getShareMdxContentCached = unstable_cache(
  async (filePath: string, version: string) => {
    void version;
    return getShareMdxContentUncached(filePath);
  },
  ["writing-share-mdx"],
  {
    revalidate: 300,
    tags: ["writing-shares"],
  },
);

/**
 * 分享列表，仅来自 Supabase `writing_shares`（无本地占位）。
 */
export async function getShares(): Promise<WritingShare[]> {
  return getSharesCached();
}

export async function getShareById(id: string): Promise<WritingShare | null> {
  return getShareByIdCached(id);
}

/**
 * Raw MDX source from Storage bucket `writing`, or null if missing / misconfigured.
 */
export async function getShareMdxContent(
  filePath: string,
  version: string,
): Promise<string | null> {
  return getShareMdxContentCached(filePath, version);
}
