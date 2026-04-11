"use client";

import { useRouter } from "next/navigation";
import {
  type FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";

import { TerminalStatusStrip } from "@/components/status-bar";
import { cn } from "@/lib/utils";

const HELP_TEXT = `可用命令: help · about · projects · writing · hello · ls · clear · sudo rm -rf /`;

const BOOT_STEPS: { kind: "cmd" | "out"; text: string }[] = [
  { kind: "cmd", text: "cat ./welcome.txt" },
  {
    kind: "out",
    text: "portfolio shell — 输入命令并回车，试试 help"
  }
];

const CMD_MS = 22;
const OUT_MS = 14;

/** 输出与输入共用：字号、行高、字重一致 */
const shellLine =
  "font-mono text-xs leading-relaxed tracking-normal antialiased";

function LogLine({ text }: { text: string }) {
  const base = cn(shellLine, "text-muted-foreground");
  if (text.startsWith("$")) {
    return (
      <div className={cn(base, "whitespace-pre-wrap break-words")}>
        <span className="text-[hsl(286_100%_73%)]">$</span>
        <span className="text-foreground/90">{text.slice(1)}</span>
      </div>
    );
  }
  if (text.startsWith(">")) {
    return (
      <div className={cn(base, "whitespace-pre-wrap break-words")}>
        <span className="text-[hsl(286_100%_73%)]">&gt;</span>
        <span className="text-foreground/90">{text.slice(1)}</span>
      </div>
    );
  }
  return (
    <div className={cn(base, "whitespace-pre-wrap break-words text-foreground/90")}>
      {text}
    </div>
  );
}

export function HeroTerminal() {
  const router = useRouter();
  const [lines, setLines] = useState<string[]>([]);
  const [bootPartial, setBootPartial] = useState("");
  const [bootDone, setBootDone] = useState(false);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const reducedRef = useRef(false);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines, bootPartial]);

  useEffect(() => {
    reducedRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedRef.current) {
      const done: string[] = [];
      for (const step of BOOT_STEPS) {
        if (step.kind === "cmd") {
          done.push(`$ ${step.text}`);
        } else {
          done.push(step.text);
        }
      }
      setLines(done);
      setBootDone(true);
      return;
    }

    let cancelled = false;
    const delay = (ms: number) =>
      new Promise<void>((r) => {
        setTimeout(r, ms);
      });

    const typeBoot = async () => {
      for (const step of BOOT_STEPS) {
        if (cancelled) return;
        if (step.kind === "cmd") {
          const full = `$ ${step.text}`;
          for (let i = 0; i <= full.length; i += 1) {
            if (cancelled) return;
            setBootPartial(full.slice(0, i));
            await delay(CMD_MS);
          }
          setLines((prev) => [...prev, full]);
          setBootPartial("");
        } else {
          for (let i = 0; i <= step.text.length; i += 1) {
            if (cancelled) return;
            setBootPartial(step.text.slice(0, i));
            await delay(OUT_MS);
          }
          setLines((prev) => [...prev, step.text]);
          setBootPartial("");
        }
      }
      if (!cancelled) {
        setBootDone(true);
      }
    };

    void typeBoot();

    return () => {
      cancelled = true;
    };
  }, []);

  const runCommand = useCallback(
    (raw: string) => {
      const cmd = raw.trim().toLowerCase();
      const push = (text: string) =>
        setLines((prev) => [
          ...prev.slice(-20),
          `> ${raw || "(空)"}`,
          text
        ]);

      switch (cmd) {
        case "":
          push("（空命令）");
          break;
        case "help":
          push(HELP_TEXT);
          break;
        case "about":
          push("跳转：关于页");
          router.push("/about");
          break;
        case "projects":
          push("跳转：项目页");
          router.push("/projects");
          break;
        case "writing":
        case "share":
          push("跳转：分享页");
          router.push("/writing");
          break;
        case "hello":
        case "hi":
          push("你好！输入 help 查看全部命令。");
          break;
        case "ls":
          push(
            "status_bar · bento_hub · nav: /about /projects /writing /contact"
          );
          break;
        case "clear":
          setLines([]);
          break;
        case "sudo rm -rf /":
          push("想得美。系统已拒绝该操作，并记了一笔。");
          break;
        default:
          push(`未知命令: ${cmd}。输入 help 查看列表。`);
      }
    },
    [router]
  );

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!bootDone) return;
    runCommand(input);
    setInput("");
  };

  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-xl sm:rounded-2xl",
        "border border-white/[0.08]",
        "bg-[hsl(0_0%_11%)]",
        "shadow-[0_12px_40px_rgb(0_0_0/0.45),0_2px_8px_rgb(0_0_0/0.25)]",
        "ring-1 ring-white/[0.06]"
      )}
    >
      {/* macOS Terminal 风格标题栏：略浅、底部分隔柔和 */}
      <div
        className={cn(
          "flex items-center gap-3 px-4 py-2.5",
          "border-b border-white/[0.06]",
          "bg-[hsl(0_0%_15%)]"
        )}
      >
        <div className="flex gap-2" aria-hidden title="窗口控制">
          {/* 经典 close / minimize / zoom 三色 */}
          <span className="size-3 shrink-0 rounded-full bg-[#ff5f57]" />
          <span className="size-3 shrink-0 rounded-full bg-[#febc2e]" />
          <span className="size-3 shrink-0 rounded-full bg-[#28c840]" />
        </div>
        <span
          className={cn(
            shellLine,
            "min-w-0 flex-1 truncate text-center text-[11px] text-muted-foreground/90 sm:text-xs"
          )}
        >
          user@portfolio — Terminal
        </span>
        <span className="w-[52px] shrink-0 sm:w-[60px]" aria-hidden />
      </div>

      <div className="flex max-h-[min(52vh,28rem)] min-h-[14rem] flex-col bg-[hsl(0_0%_9%)]">
        <div
          ref={scrollRef}
          className="min-h-0 flex-1 space-y-0 overflow-y-auto overscroll-contain px-4 py-3"
          role="log"
          aria-live="polite"
        >
          {lines.map((line, i) => (
            <LogLine key={`${i}-${line.slice(0, 32)}`} text={line} />
          ))}
          {bootPartial !== "" && (
            <div className={cn(shellLine, "text-foreground/90")}>
              {bootPartial.startsWith("$") ? (
                <>
                  <span className="text-[hsl(286_100%_73%)]">$</span>
                  <span>{bootPartial.slice(1)}</span>
                  <span className="terminal-cursor ml-0.5 inline-block h-[1em] w-2 translate-y-[0.12em] bg-primary align-middle" />
                </>
              ) : (
                <>
                  <span className="text-muted-foreground">{bootPartial}</span>
                  <span className="terminal-cursor ml-0.5 inline-block h-[1em] w-2 translate-y-[0.12em] bg-primary align-middle" />
                </>
              )}
            </div>
          )}
        </div>

        <form
          onSubmit={onSubmit}
          className={cn(
            shellLine,
            "flex shrink-0 items-center gap-2 border-t border-white/[0.06] px-4 py-3",
            "bg-[hsl(0_0%_9%)] text-foreground/90"
          )}
        >
          <label htmlFor="hero-shell-input" className="sr-only">
            Shell 命令
          </label>
          <span className="shrink-0 select-none text-[hsl(286_100%_73%)]">
            $
          </span>
          <input
            id="hero-shell-input"
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={!bootDone}
            className={cn(
              shellLine,
              "min-w-0 flex-1 border-0 bg-transparent p-0 text-foreground/90",
              "outline-none ring-0 placeholder:text-muted-foreground",
              "focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50"
            )}
            placeholder={bootDone ? "help — Enter 执行" : "…"}
            autoComplete="off"
            spellCheck={false}
            aria-label="终端命令输入"
          />
          <span className="hidden shrink-0 text-muted-foreground sm:inline">
            ↵
          </span>
          <button type="submit" className="sr-only">
            执行
          </button>
        </form>
      </div>

      <TerminalStatusStrip />
    </div>
  );
}
