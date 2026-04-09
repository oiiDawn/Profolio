import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const shares = [
  {
    id: "01",
    title: "我如何管理长期学习计划",
    desc: "用季度目标 + 每周复盘，把「想学很多」变成「持续推进」。",
    tag: "学习方法"
  },
  {
    id: "02",
    title: "做项目时最有用的 3 个习惯",
    desc: "先定义问题、先做最小闭环、每次迭代只解决一个核心阻塞。",
    tag: "项目实践"
  },
  {
    id: "03",
    title: "我的效率系统（工具 + 流程）",
    desc: "从灵感收集到执行追踪，搭建一个不依赖意志力的工作流。",
    tag: "个人效率"
  }
];

const timeline = [
  { year: "2022", event: "开始系统学习前端开发" },
  { year: "2023", event: "完成多个个人项目并持续迭代" },
  { year: "2024", event: "关注产品思维与用户体验" },
  { year: "Now", event: "构建长期内容分享与个人品牌" }
];

const stackTags = [
  "NEXT_JS",
  "TYPESCRIPT",
  "PRODUCT_UX",
  "CONTENT"
];

/** 顶栏与页脚共用；请把 href 换成你的真实链接 */
const contactLinks = [
  {
    label: "邮箱",
    href: "mailto:oii.zhangjm@gmail.com",
    external: false,
    ariaLabel: "发送邮件"
  },
  {
    label: "GitHub",
    href: "https://github.com/oiidawn",
    external: true,
    ariaLabel: "在 GitHub 打开个人主页"
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/yourprofile",
    external: true,
    ariaLabel: "在 LinkedIn 打开"
  },
  {
    label: "X",
    href: "https://x.com/oiidawn",
    external: true,
    ariaLabel: "在 X 打开"
  }
] as const;

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[hsl(286_100%_73%)]">
      {children}
    </p>
  );
}

function ContactLinksNav({
  className,
  id,
  itemClassName
}: {
  className?: string;
  id?: string;
  itemClassName?: string;
}) {
  return (
    <nav
      id={id}
      className={className}
      aria-label="联系方式与社交媒体"
    >
      {contactLinks.map((link) => (
        <a
          key={link.label}
          href={link.href}
          className={
            itemClassName ??
            "font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-primary"
          }
          aria-label={link.ariaLabel}
          {...(link.external
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}

export default function HomePage() {
  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 z-[100] scanline-overlay"
        aria-hidden
      />

      {/* Top bar */}
      <header className="fixed top-0 right-0 left-0 z-50 flex h-16 items-center justify-between border-b border-white/5 bg-black/40 px-4 backdrop-blur-xl shadow-[0_0_30px_rgb(143_245_255/0.05)] sm:px-6">
        <div className="flex flex-wrap items-center gap-3 md:gap-6">
          <span className="font-mono text-lg font-black tracking-[-0.05em] text-primary">
            [CORE_SYSTEM]
          </span>
          <span className="hidden h-4 w-px bg-white/10 sm:block" />
          <nav
            className="flex flex-wrap items-center gap-3 sm:gap-6"
            aria-label="页面主导航"
          >
            <Button
              size="sm"
              variant="ghost"
              className="nav-link-terminal font-mono"
              render={<a href="#about" aria-label="跳转到关于我" />}
            >
              关于
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="nav-link-terminal font-mono"
              render={<a href="#timeline" aria-label="跳转到成长轨迹" />}
            >
              轨迹
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="nav-link-terminal font-mono"
              render={<a href="#shares" aria-label="跳转到个人分享" />}
            >
              分享
            </Button>
          </nav>
        </div>
        <ContactLinksNav className="flex max-w-[min(100%,36rem)] flex-wrap items-center justify-end gap-x-3 gap-y-1 sm:gap-x-4" />
      </header>

      <main id="top" className="relative min-h-screen pt-16">
        <div className="circuit-bg pointer-events-none absolute inset-0 opacity-40" />

        {/* Hero */}
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
              <Button render={<a href="#about" />}>了解我</Button>
              <Button variant="outline" render={<a href="#shares" />}>
                看看分享
              </Button>
            </div>
          </div>
        </section>

        {/* Bento preview — links hero to rest */}
        <section className="relative border-y border-white/5 bg-[hsl(0_0%_7.5%)] px-4 py-10 sm:px-8">
          <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
            <div className="group relative aspect-video overflow-hidden border border-white/5 bg-card md:col-span-2">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-[hsl(286_100%_73%/0.08)]" />
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <span className="font-mono text-[10px] tracking-widest text-primary">
                  [PREVIEW_01]
                </span>
                <h2 className="font-heading text-xl font-bold uppercase italic tracking-tight sm:text-2xl">
                  长期主义 · 个人站点
                </h2>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <div className="flex flex-1 flex-col justify-between border border-white/5 bg-card p-6 transition-colors hover:border-primary/30">
                <SectionLabel>[SECTION_08]</SectionLabel>
                <p className="mt-4 text-sm italic leading-relaxed text-muted-foreground">
                  「代码不只是逻辑，也是把现实搭起来的结构语言。」
                </p>
              </div>
              <a
                href="#shares"
                className="group flex h-40 flex-col justify-between border border-primary/40 bg-primary p-6 text-primary-foreground neon-glow-sm transition-transform hover:-translate-y-0.5"
              >
                <h3 className="font-heading text-2xl font-black uppercase leading-none">
                  进入
                  <br />
                  分享库
                </h3>
                <span className="self-end font-mono text-sm transition-transform group-hover:translate-x-1">
                  →
                </span>
              </a>
            </div>
          </div>
        </section>

        {/* About — bento */}
        <section
          id="about"
          className="relative scroll-mt-24 px-4 py-16 sm:px-8 lg:py-20"
        >
          <div className="mx-auto max-w-6xl">
            <SectionLabel>[MODULE_ABOUT]</SectionLabel>
            <h2 className="mt-2 font-heading text-3xl font-bold uppercase tracking-tighter sm:text-5xl">
              我在做什么
            </h2>
            <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12">
              <div className="space-y-4 lg:col-span-7">
                <p className="leading-relaxed text-muted-foreground">
                  我专注于前端开发与产品体验，擅长从用户场景出发，把复杂需求拆解为可落地方案。相比「堆功能」，我更在意信息结构是否清晰、交互是否自然、页面是否真正解决问题。
                </p>
                <p className="leading-relaxed text-muted-foreground">
                  除了写代码，我也持续做知识沉淀，分享学习路径、项目方法和效率系统的实践，希望帮助更多人稳定成长。
                </p>
              </div>
              <Card className="border-white/10 bg-[hsl(0_0%_12.5%)] lg:col-span-5">
                <CardHeader>
                  <span className="font-mono text-[10px] text-primary">
                    CORE_STACK
                  </span>
                  <CardTitle className="text-lg uppercase">关键词</CardTitle>
                  <CardDescription>当前最关注的方向。</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 font-mono text-xs">
                  <div className="flex justify-between border-b border-white/5 py-2">
                    <span className="text-muted-foreground">前端</span>
                    <span className="text-primary">Next.js / TS</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 py-2">
                    <span className="text-muted-foreground">产品</span>
                    <span className="text-primary">体验与结构</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">成长</span>
                    <span className="text-primary">内容沉淀</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Timeline — log */}
        <section
          id="timeline"
          className="scroll-mt-24 border-t border-white/5 bg-[hsl(0_0%_7.5%)] px-4 py-16 sm:px-8"
        >
          <div className="mx-auto max-w-6xl">
            <SectionLabel>[TIMELINE_LOG]</SectionLabel>
            <h2 className="mt-2 font-heading text-3xl font-bold uppercase tracking-tighter sm:text-5xl">
              成长轨迹
            </h2>
            <div className="mt-10 border border-white/5 bg-card">
              {timeline.map((item) => (
                <div
                  key={item.year}
                  className="border-b border-white/5 p-4 transition-colors last:border-b-0 hover:bg-white/[0.02] sm:grid sm:grid-cols-[100px_1fr] sm:gap-6 sm:p-6"
                >
                  <div className="mb-2 font-mono text-sm text-primary sm:mb-0">
                    [{item.year}]
                  </div>
                  <p className="font-mono text-sm leading-relaxed text-muted-foreground sm:text-base">
                    <span className="text-[hsl(286_100%_73%)]">$</span>{" "}
                    {item.event}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Shares — vault bento */}
        <section
          id="shares"
          className="scroll-mt-24 px-4 py-16 sm:px-8 lg:py-20"
        >
          <div className="mx-auto max-w-6xl">
            <Badge variant="outline" className="mb-4">
              SHARES
            </Badge>
            <h2 className="font-heading text-3xl font-bold uppercase tracking-tighter sm:text-5xl">
              个人分享
            </h2>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              我会定期输出关于学习、项目实践和个人效率的可执行经验，尽量讲清楚方法背后的逻辑。
            </p>

            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
              {shares.map((share) => (
                <Card
                  key={share.title}
                  className="group relative overflow-hidden border-white/10 bg-[hsl(0_0%_12.5%)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_-12px_rgb(143_245_255/0.25)]"
                >
                  <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-primary via-[hsl(286_100%_73%)] to-[hsl(353_100%_72%)]" />
                  <CardHeader>
                    <span className="font-mono text-[10px] text-primary">
                      [PROJECT_{share.id}]
                    </span>
                    <CardDescription className="font-mono text-[10px] uppercase tracking-wider text-[hsl(286_100%_73%)]">
                      {share.tag}
                    </CardDescription>
                    <CardTitle className="text-xl uppercase leading-snug">
                      {share.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4">
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {share.desc}
                    </p>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-fit font-mono text-[10px] uppercase tracking-widest"
                      render={
                        <a
                          href="#"
                          aria-label={`阅读 ${share.title} 的更多内容`}
                        />
                      }
                    >
                      阅读更多
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="border-t border-white/5 px-4 py-16 sm:px-8">
          <div className="mx-auto max-w-6xl">
            <SectionLabel>[CONTACT]</SectionLabel>
            <h2 className="mt-2 font-heading text-3xl font-bold uppercase tracking-tighter sm:text-5xl">
              一起交流
            </h2>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              欢迎通过邮箱或社交平台联系我，聊项目合作、学习成长或任何有趣想法。
            </p>
            <Separator className="my-8" />
            <div className="flex flex-wrap items-center gap-3">
              <Button
                className="font-mono"
                render={
                  <a
                    href={
                      contactLinks.find((l) => l.href.startsWith("mailto:"))
                        ?.href ?? "mailto:hello@example.com"
                    }
                  />
                }
              >
                {
                  contactLinks.find((l) => l.href.startsWith("mailto:"))?.href.replace(
                    "mailto:",
                    ""
                  ) ?? "hello@example.com"
                }
              </Button>
              <Button variant="outline" render={<a href="#top" />}>
                回到顶部
              </Button>
            </div>
          </div>
        </section>

        {/* Footer — status bar */}
        <footer className="border-t border-cyan-900/40 bg-black px-4 py-8 sm:px-8">
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
              © {new Date().getFullYear()} Your Name · ALL RIGHTS RESERVED
            </p>
            <ContactLinksNav
              className="flex flex-wrap gap-x-6 gap-y-2"
              itemClassName="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
            />
            <div className="flex items-center gap-2 font-mono text-[10px] text-primary/80">
              <span className="size-2 animate-pulse rounded-full bg-primary shadow-[0_0_8px_#8ff5ff]" />
              <span>SYSTEM_LOG: HELLO_WORLD_SUCCESSFUL</span>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
