"use client";

import { useEffect } from "react";

import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";

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
      <section className="px-4 py-20 sm:px-8">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            分享列表加载失败
          </h1>
          <p className="mt-4 text-muted-foreground" data-testid="writing-route-error">
            数据服务暂时不可用，请稍后重试。
          </p>
          <Button onClick={reset} className="mt-8">
            重新加载
          </Button>
        </div>
      </section>
    </PageShell>
  );
}
