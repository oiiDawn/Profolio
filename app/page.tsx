import Link from "next/link";

import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { stackTags } from "@/lib/site";

const hubLinks = [
  {
    id: "01",
    href: "/about",
    label: "关于",
    sub: "简介 · 轨迹 · 技能栈",
    accent: "border-white/5 bg-card hover:border-primary/30"
  },
  {
    id: "02",
    href: "/projects",
    label: "项目",
    sub: "代码仓库与 side project",
    accent: "border-white/5 bg-card hover:border-primary/30"
  },
  {
    id: "03",
    href: "/writing",
    label: "分享",
    sub: "学习方法与效率笔记",
    accent: "border-white/5 bg-card hover:border-primary/30"
  },
  {
    id: "04",
    href: "mailto:oii.zhangjm@gmail.com",
    label: "联系",
    sub: "邮件与合作咨询",
    accent: "border-primary/40 bg-primary text-primary-foreground neon-glow-sm",
    external: false
  }
] as const;

export default function HomePage() {
  return (
    <PageShell>
      <section className="relative overflow-hidden px-4 py-16 sm:px-8 sm:py-20 lg:py-24">
        <div className="relative z-10 mx-auto max-w-5xl">
          <div
            className="reveal mb-6 flex items-center gap-2 [--delay:40ms]"
            style={{ animationDelay: "40ms" }}
          >
            <span className="h-px w-8 bg-[hsl(286_100%_73%)]" />
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[hsl(286_100%_73%)]">
              Init sequence
            </span>
          </div>
          <h1 className="reveal font-heading text-4xl font-bold uppercase leading-[0.95] tracking-tighter sm:text-6xl lg:text-7xl [--delay:80ms] whitespace-nowrap">
            解构
            <span className="terminal-glow text-primary italic">未来</span>
          </h1>
          <p className="reveal mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg [--delay:120ms]">
            我热爱把想法做成可用的产品，也喜欢把经验整理成清晰可复用的内容。这里是我的个人主页：经历、方向与持续更新的分享。
          </p>

          <div
            className="reveal relative mt-10 max-w-3xl [--delay:160ms]"
            style={{ animationDelay: "160ms" }}
          >
            <div className="glass-panel rounded-none p-px">
              <div className="border border-white/5 bg-[hsl(0_0%_12.5%/0.6)] p-5 sm:p-6">
                <div className="mb-4 flex items-center gap-2 border-b border-white/5 pb-4">
                  <div className="flex gap-1.5">
                    <div className="size-2 rounded-full bg-destructive/50" />
                    <div className="size-2 rounded-full bg-primary/50" />
                    <div className="size-2 rounded-full bg-[hsl(286_100%_73%/0.5)]" />
                  </div>
                  <span className="font-mono text-[10px] uppercase text-muted-foreground">
                    user@portfolio:~ bio --verbose
                  </span>
                </div>
                <p className="font-mono text-sm leading-relaxed text-primary/90">
                  <span className="text-[hsl(286_100%_73%)]">$</span>{" "}
                  加载个人档案…
                  <br />
                  <span className="text-[hsl(286_100%_73%)]">$</span>{" "}
                  分析完成。系统就绪。
                  <br />
                  <br />
                  <span className="text-foreground">
                    专注于前端与产品体验，把复杂需求拆成可落地方案；持续写代码，也持续写清楚的方法论。
                  </span>
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="font-mono text-[10px] text-muted-foreground">
                    [STACK]
                  </span>
                  {stackTags.map((t) => (
                    <span key={t} className="font-mono text-[10px] text-primary">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-[hsl(286_100%_73%)]">&gt;</span>
                  <span className="terminal-cursor inline-block h-4 w-2 bg-primary" />
                </div>
              </div>
            </div>
            <div className="absolute -top-px left-0 h-0.5 w-full bg-primary/30 shadow-[0_0_10px_#8ff5ff]" />
          </div>

          <div className="reveal mt-8 flex flex-wrap gap-3 [--delay:200ms]">
            <Button render={<Link href="/about" />}>了解我</Button>
            <Button variant="outline" render={<Link href="/writing" />}>
              看看分享
            </Button>
          </div>
        </div>
      </section>

      {/* Hub — 四入口 */}
      <section className="relative border-y border-white/5 bg-[hsl(0_0%_7.5%)] px-4 py-12 sm:px-8">
        <div className="relative z-10 mx-auto max-w-6xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[hsl(286_100%_73%)]">
            [NAV_HUB]
          </p>
          <h2 className="mt-2 font-heading text-2xl font-bold uppercase tracking-tighter sm:text-3xl">
            选择模块
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            各页独立加载，避免单页滚动过长；内容与排版会持续迭代。
          </p>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {hubLinks.map((item) => {
              const isMail = item.href.startsWith("mailto:");
              const className = `group flex min-h-[140px] flex-col justify-between border p-6 transition-transform hover:-translate-y-0.5 ${item.accent}`;
              const inner = (
                <>
                  <div>
                    <span className="font-mono text-[10px] text-primary/80">
                      [ENTRY_{item.id}]
                    </span>
                    <h3 className="mt-3 font-heading text-xl font-black uppercase leading-tight">
                      {item.label}
                    </h3>
                    <p
                      className={`mt-2 text-xs leading-relaxed ${isMail ? "text-primary-foreground/90" : "text-muted-foreground"}`}
                    >
                      {item.sub}
                    </p>
                  </div>
                  <span className="self-end font-mono text-sm transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </>
              );
              if (isMail) {
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className={className}
                    aria-label="发送邮件联系"
                  >
                    {inner}
                  </a>
                );
              }
              return (
                <Link key={item.href} href={item.href} className={className}>
                  {inner}
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
