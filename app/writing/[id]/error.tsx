"use client";

import { useEffect } from "react";
import Link from "next/link";

import { PageShell } from "@/components/page-shell";
import { Badge } from "@/components/ui/badge";

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
      <section className="relative px-4 py-20 sm:px-8">
        <div className="mx-auto max-w-2xl">
          <Badge variant="outline" className="mb-4">
            ERROR
          </Badge>
          <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            文章加载失败
          </h1>
          <p className="mt-4 text-muted-foreground" data-testid="writing-article-route-error">
            这篇内容暂时无法展示。你可以重试，或先返回分享列表。
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={reset}
              className="focus-terminal rounded border border-primary/40 px-4 py-2 font-mono text-xs uppercase tracking-widest text-primary"
            >
              重试
            </button>
            <Link
              href="/writing"
              className="focus-terminal inline-flex items-center rounded border border-white/15 px-4 py-2 font-mono text-xs uppercase tracking-widest text-muted-foreground"
            >
              返回列表
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
