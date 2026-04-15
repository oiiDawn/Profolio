import type { Metadata } from "next";

import { WritingPageView } from "@/app/writing/writing-page-view";
import { getShares } from "@/lib/writing";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "分享",
  description: "学习方法、项目实践与个人效率笔记",
};

export default async function WritingPage() {
  const shares = await getShares();
  const hasSupabasePublicEnv = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );

  return (
    <WritingPageView
      shares={shares}
      hasSupabasePublicEnv={hasSupabasePublicEnv}
    />
  );
}
