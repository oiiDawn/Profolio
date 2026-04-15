import Link from "next/link";

import { PageShell } from "@/components/page-shell";
import { Badge } from "@/components/ui/badge";

export default function WritingArticleNotFound() {
  return (
    <PageShell>
      <section className="relative px-4 py-20 sm:px-8">
        <div className="mx-auto max-w-2xl">
          <Badge variant="outline" className="mb-4">
            404
          </Badge>
          <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            分享内容不存在
          </h1>
          <p className="mt-4 text-muted-foreground" data-testid="writing-article-not-found">
            你访问的文章可能已删除、未发布，或者链接不完整。
          </p>
          <Link
            href="/writing"
            className="focus-terminal mt-8 inline-flex font-mono text-xs uppercase tracking-widest text-primary"
          >
            ← 返回分享列表
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
