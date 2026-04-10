"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useCallback, useRef, useState } from "react";

const HELP_TEXT = `可用命令: help · about · projects · writing · hello · ls · clear · sudo rm -rf /`;

export function QuickTerminal() {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [lines, setLines] = useState<string[]>([
    "输入命令并回车。试试 help"
  ]);
  const inputRef = useRef<HTMLInputElement>(null);

  const runCommand = useCallback(
    (raw: string) => {
      const cmd = raw.trim().toLowerCase();
      const push = (text: string) =>
        setLines((prev) => [...prev.slice(-12), `> ${raw || "(空)"}`, text]);

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
          push("你好！欢迎来玩终端。输入 help 查看全部命令。");
          break;
        case "ls":
          push(
            "hero · status_bar · bento_hub · nav: /about /projects /writing /contact"
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
    runCommand(input);
    setInput("");
  };

  return (
    <div className="border-t border-white/5 bg-[hsl(0_0%_6%/0.5)] px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[hsl(286_100%_73%)]">
          [QUICK_TERM]
        </p>
        <h2 className="mt-2 font-heading text-lg font-bold uppercase tracking-tighter">
          快捷终端
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          桌面端可玩；移动端同样可用，输入 help 开始。
        </p>

        <div
          className="mt-4 border border-white/10 bg-[hsl(0_0%_6%/0.8)] p-4 font-mono text-xs leading-relaxed text-muted-foreground"
          role="log"
          aria-live="polite"
        >
          {lines.map((line, i) => (
            <div key={`${i}-${line.slice(0, 24)}`} className="text-foreground/90">
              {line}
            </div>
          ))}
        </div>

        <form onSubmit={onSubmit} className="mt-3 flex items-center gap-2">
          <span className="shrink-0 text-[hsl(286_100%_73%)]">&gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => inputRef.current?.scrollIntoView({ block: "nearest" })}
            className="min-w-0 flex-1 border border-white/10 bg-transparent px-2 py-2 font-mono text-sm text-foreground outline-none placeholder:text-muted-foreground/50 focus-visible:border-primary/50 focus-visible:ring-1 focus-visible:ring-primary/30"
            placeholder="help"
            autoComplete="off"
            spellCheck={false}
            aria-label="快捷终端命令输入"
          />
          <button
            type="submit"
            className="shrink-0 border border-primary/40 bg-primary/10 px-3 py-2 font-mono text-xs uppercase tracking-wider text-primary transition-colors hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            执行
          </button>
        </form>
      </div>
    </div>
  );
}
