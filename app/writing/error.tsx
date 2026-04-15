"use client";

import { useEffect } from "react";

import { PageShell } from "@/components/page-shell";
import { Badge } from "@/components/ui/badge";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function WritingRouteError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("[writing] route error:", error);
  }, [error]);

  return (
    <PageShell>
      <section className="relative px-4 py-20 sm:px-8">
        <div className="mx-auto max-w-2xl">
          <Badge variant="outline" className="mb-4">
            ERROR
          </Badge>
          <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            分享列表加载失败
          </h1>
          <p className="mt-4 text-muted-foreground" data-testid="writing-route-error">
            数据服务暂时不可用，请稍后重试。
          </p>
          <button
            type="button"
            onClick={reset}
            className="focus-terminal mt-8 rounded border border-primary/40 px-4 py-2 font-mono text-xs uppercase tracking-widest text-primary"
          >
            重新加载
          </button>
        </div>
      </section>
    </PageShell>
  );
}
