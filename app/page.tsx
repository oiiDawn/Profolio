import Link from "next/link";

import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <PageShell>
      <section className="flex min-h-0 flex-1 flex-col items-center justify-center px-4 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-4">
            welcome
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            嗨，我是 oii
          </h1>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            这是我的个人空间，放我折腾的项目、走过的路，和脑子里冒出来的想法。
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/projects">看看项目</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/about">了解更多</Link>
            </Button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
