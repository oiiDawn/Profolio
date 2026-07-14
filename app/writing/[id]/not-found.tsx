import Link from "next/link";

import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";

export default function WritingArticleNotFound() {
  return (
    <PageShell>
      <section className="px-4 py-20 sm:px-8">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            分享内容不存在
          </h1>
          <p className="mt-4 text-muted-foreground" data-testid="writing-article-not-found">
            你访问的文章可能已删除、未发布，或者链接不完整。
          </p>
          <Button variant="outline" asChild className="mt-8">
            <Link href="/writing">← 返回分享列表</Link>
          </Button>
        </div>
      </section>
    </PageShell>
  );
}
