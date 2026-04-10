import Link from "next/link";

import { CursorGlow } from "@/components/cursor-glow";
import { HeroTerminal } from "@/components/hero-terminal";
import { PageShell } from "@/components/page-shell";
import { QuickTerminal } from "@/components/quick-terminal";
import { RevealOnScroll } from "@/components/reveal-on-scroll";
import { StatusBar } from "@/components/status-bar";
import { TiltCard } from "@/components/tilt-card";
import { TypingCycle } from "@/components/typing-cycle";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { contactLinks, shares, siteOwner, stackTags } from "@/lib/site";

const githubHref =
  contactLinks.find((l) => l.label === "GitHub")?.href ??
  "https://github.com/oiidawn";

const latestShare = shares[shares.length - 1];

const cardBase =
  "group relative flex min-h-[140px] flex-col justify-between border border-white/5 bg-card p-5 transition-[box-shadow,transform] duration-200 hover:border-primary/30 hover:shadow-[0_0_24px_rgb(143_245_255/0.12)]";

export default function HomePage() {
  return (
    <PageShell>
      <CursorGlow />

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
          <h1
            className="reveal max-w-[100vw] font-heading text-4xl font-bold uppercase leading-[0.95] tracking-tighter sm:text-6xl lg:text-7xl [--delay:80ms]"
            style={{ animationDelay: "80ms" }}
            aria-label="解构未来"
          >
            <span className="inline-block">解构</span>{" "}
            <TypingCycle className="inline-block min-[380px]:whitespace-nowrap" />
          </h1>
          <p className="reveal mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg [--delay:120ms]">
            我热爱把想法做成可用的产品，也喜欢把经验整理成清晰可复用的内容。这里是我的个人主页：经历、方向与持续更新的分享。
          </p>

          <div
            className="reveal relative mt-10 max-w-3xl [--delay:160ms]"
            style={{ animationDelay: "160ms" }}
          >
            <HeroTerminal />
            <div className="absolute -top-px left-0 h-0.5 w-full bg-primary/30 shadow-[0_0_10px_#8ff5ff]" />
          </div>

          <div className="reveal mt-8 flex flex-wrap gap-3 [--delay:200ms]">
            <Link
              href="/about"
              className={cn(buttonVariants(), "neon-pulse")}
            >
              了解我
            </Link>
            <Link href="/writing" className={buttonVariants({ variant: "outline" })}>
              看看分享
            </Link>
          </div>
        </div>
      </section>

      <StatusBar />

      {/* Bento Hub */}
      <section className="relative border-y border-white/5 bg-[hsl(0_0%_7.5%)] px-4 py-12 sm:px-8">
        <div className="relative z-10 mx-auto max-w-6xl">
          <RevealOnScroll delayMs={0}>
            <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[hsl(286_100%_73%)]">
              [NAV_HUB]
            </p>
            <h2 className="mt-2 font-heading text-2xl font-bold uppercase tracking-tighter sm:text-3xl">
              选择模块
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              非对称 Bento：把入口拆成可探索的模块；悬停时有轻微倾斜与霓虹描边。
            </p>
          </RevealOnScroll>

          <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-4 lg:grid-rows-[auto_auto_auto] lg:items-stretch">
            {/* Featured — 2x2 */}
            <RevealOnScroll
              delayMs={40}
              className="h-full lg:col-span-2 lg:row-span-2 lg:row-start-1"
            >
              <TiltCard className="h-full min-h-[280px]">
                <div
                  className="relative flex h-full min-h-[260px] flex-col justify-end overflow-hidden border border-white/5 bg-linear-to-br from-[hsl(0_0%_14%)] to-[hsl(0_0%_8%)] p-6 transition-[box-shadow,transform] duration-200 hover:border-primary/30 hover:shadow-[0_0_32px_rgb(213_117_255/0.1)]"
                >
                  <div
                    className="pointer-events-none absolute inset-0 font-mono text-[7px] leading-[1.1] text-primary/10 sm:text-[8px]"
                    aria-hidden
                  >
                    {`01001111 01001001 01001001\n00101111 01000100 01000001 01010111 01001110\n00101111 00101111 00101111\n.... .-.. .- -.-. -.-. -.-- .... .- -.-. -.-\n`}
                  </div>
                  <div className="relative">
                    <span className="font-mono text-[10px] text-primary/80">
                      [IDENTITY_CORE]
                    </span>
                    <p className="mt-3 font-heading text-3xl font-black uppercase tracking-tighter text-foreground sm:text-4xl">
                      {siteOwner}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      前端 · 产品 · 内容
                    </p>
                    <p className="mt-4 max-w-md text-sm leading-relaxed text-foreground/90">
                      把复杂需求拆成可落地方案；持续迭代个人站点与方法论笔记。
                    </p>
                  </div>
                </div>
              </TiltCard>
            </RevealOnScroll>

            {/* Skills */}
            <RevealOnScroll
              delayMs={80}
              className="h-full lg:col-start-3 lg:row-start-1"
            >
              <TiltCard className="h-full">
                <div className={`${cardBase} h-full`}>
                  <div>
                    <span className="font-mono text-[10px] text-primary/80">
                      [STACK]
                    </span>
                    <h3 className="mt-3 font-heading text-lg font-black uppercase leading-tight">
                      技能栈
                    </h3>
                    <p className="mt-2 text-xs text-muted-foreground">
                      悬停标签查看 emphasis
                    </p>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {stackTags.map((t) => (
                      <span
                        key={t}
                        className="border border-primary/20 bg-primary/5 px-2 py-1 font-mono text-[10px] text-primary transition-colors hover:border-primary/50 hover:bg-primary/15 hover:shadow-[0_0_12px_rgb(143_245_255/0.2)]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </TiltCard>
            </RevealOnScroll>

            {/* GitHub */}
            <RevealOnScroll
              delayMs={120}
              className="h-full lg:col-start-4 lg:row-start-1"
            >
              <TiltCard className="h-full">
                <a
                  href={githubHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${cardBase} h-full border-dashed border-primary/25`}
                  aria-label="在 GitHub 打开 oiidawn"
                >
                  <div>
                    <span className="font-mono text-[10px] text-primary/80">
                      [REMOTE]
                    </span>
                    <div className="mt-3 flex items-center gap-2">
                      <GitHubIcon className="size-8 text-primary" />
                    </div>
                    <h3 className="mt-3 font-heading text-lg font-black uppercase">
                      GitHub
                    </h3>
                    <p className="mt-1 font-mono text-xs text-muted-foreground">
                      @oiidawn
                    </p>
                  </div>
                  <span className="self-end font-mono text-sm transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </a>
              </TiltCard>
            </RevealOnScroll>

            {/* Latest share */}
            <RevealOnScroll
              delayMs={100}
              className="h-full lg:col-span-2 lg:col-start-3 lg:row-start-2"
            >
              <TiltCard className="h-full">
                <Link
                  href="/writing"
                  className={`${cardBase} h-full min-h-[120px] border-accent/30 hover:border-accent/50`}
                >
                  <div className="flex flex-1 flex-col justify-between gap-3 sm:flex-row sm:items-end">
                    <div>
                      <span className="font-mono text-[10px] text-[hsl(286_100%_73%)]">
                        [LATEST_SHARE]
                      </span>
                      <h3 className="mt-2 font-heading text-xl font-black uppercase leading-tight">
                        {latestShare.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                        {latestShare.desc}
                      </p>
                      <p className="mt-2 font-mono text-[10px] text-muted-foreground">
                        {latestShare.tag} · {latestShare.readTime}
                      </p>
                    </div>
                    <span className="font-mono text-sm text-primary transition-transform group-hover:translate-x-1">
                      阅读 &gt;
                    </span>
                  </div>
                </Link>
              </TiltCard>
            </RevealOnScroll>

            {/* About */}
            <RevealOnScroll
              delayMs={140}
              className="h-full lg:col-start-1 lg:row-start-3"
            >
              <TiltCard className="h-full">
                <Link href="/about" className={`${cardBase} h-full`}>
                  <div>
                    <span className="font-mono text-[10px] text-primary/80">
                      [ENTRY_01]
                    </span>
                    <h3 className="mt-3 font-heading text-xl font-black uppercase leading-tight">
                      关于
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      简介 · 轨迹 · 技能栈
                    </p>
                  </div>
                  <span className="self-end font-mono text-sm transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </TiltCard>
            </RevealOnScroll>

            {/* Projects */}
            <RevealOnScroll
              delayMs={180}
              className="h-full lg:col-start-2 lg:row-start-3"
            >
              <TiltCard className="h-full">
                <Link href="/projects" className={`${cardBase} h-full`}>
                  <div>
                    <span className="font-mono text-[10px] text-primary/80">
                      [ENTRY_02]
                    </span>
                    <h3 className="mt-3 font-heading text-xl font-black uppercase leading-tight">
                      项目
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      代码仓库与 side project
                    </p>
                  </div>
                  <span className="self-end font-mono text-sm transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </TiltCard>
            </RevealOnScroll>

            {/* Contact CTA */}
            <RevealOnScroll
              delayMs={220}
              className="h-full lg:col-span-2 lg:col-start-3 lg:row-start-3"
            >
              <TiltCard className="h-full">
                <a
                  href="mailto:oii.zhangjm@gmail.com"
                  className="group flex min-h-[140px] flex-col justify-between border border-primary/40 bg-primary p-6 text-primary-foreground neon-glow-sm transition-transform hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgb(143_245_255/0.35)]"
                  aria-label="发送邮件联系"
                >
                  <div>
                    <span className="font-mono text-[10px] text-primary-foreground/80">
                      [ENTRY_04 · CONTACT]
                    </span>
                    <h3 className="mt-3 font-heading text-xl font-black uppercase leading-tight">
                      开始对话
                    </h3>
                    <p className="mt-2 text-xs text-primary-foreground/90">
                      邮件与合作咨询
                    </p>
                    <p className="mt-4 font-mono text-sm text-primary-foreground/95">
                      oii.zhangjm@gmail.com
                    </p>
                  </div>
                  <span className="self-end font-mono text-sm transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </a>
              </TiltCard>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      <QuickTerminal />
    </PageShell>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}
