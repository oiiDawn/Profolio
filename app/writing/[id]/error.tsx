"use client";

import { useEffect } from "react";
import Link from "next/link";

import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function WritingArticleError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("[writing][id] route error:", error);
  }, [error]);

  return (
    <PageShell>
      <section className="px-4 py-20 sm:px-8">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            文章加载失败
          </h1>
          <p className="mt-4 text-muted-foreground" data-testid="writing-article-route-error">
            这篇内容暂时无法展示。你可以重试，或先返回分享列表。
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button onClick={reset}>重试</Button>
            <Button variant="outline" asChild>
              <Link href="/writing">返回列表</Link>
            </Button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
