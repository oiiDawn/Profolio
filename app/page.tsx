import { CursorGlow } from "@/components/cursor-glow";
import { HeroTerminal } from "@/components/hero-terminal";
import { PageShell } from "@/components/page-shell";
import { TypingCycle } from "@/components/typing-cycle";

export default function HomePage() {
  return (
    <PageShell>
      <CursorGlow />

      <section className="relative flex min-h-0 flex-1 flex-col px-4 py-10 sm:px-8 lg:min-h-0 lg:justify-center lg:py-6">
        <div className="relative z-10 mx-auto w-full max-w-5xl">
          <div
            className="reveal mb-4 flex items-center gap-2 [--delay:40ms] lg:mb-3"
            style={{ animationDelay: "40ms" }}
          >
            <span className="h-px w-8 bg-accent" />
            <span className="text-label">welcome</span>
          </div>
          <h1
            className="reveal max-w-[100vw] font-heading text-4xl font-bold leading-[0.95] tracking-tighter sm:text-6xl lg:text-6xl [--delay:80ms]"
            style={{ animationDelay: "80ms" }}
            aria-label="嗨，我是 oii"
          >
            嗨，我是 <span className="terminal-glow text-primary">oii</span>
          </h1>
          <p
            className="reveal mt-3 flex items-center gap-2 font-mono text-sm text-muted-foreground sm:text-base [--delay:100ms]"
            style={{ animationDelay: "100ms" }}
          >
            <span className="text-accent">▍</span>
            正在<TypingCycle className="inline-block" />
          </p>
          <p className="reveal mt-4 w-full text-base leading-relaxed text-muted-foreground sm:text-lg lg:mt-3 [--delay:120ms]">
            这是我的个人空间，放我折腾的项目、走过的路，和脑子里冒出来的想法。
            <br />
            随便逛逛吧。
          </p>

          <div
            className="reveal relative z-10 mt-8 w-full [--delay:160ms] lg:mt-6"
            style={{ animationDelay: "160ms" }}
          >
            <HeroTerminal />
          </div>
        </div>
      </section>
    </PageShell>
  );
}
