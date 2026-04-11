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

type ChatLine =
  | { role: "user"; text: string }
  | { role: "assistant"; text: string };

const GREETING: ChatLine = {
  role: "assistant",
  text: "嗨！有什么想了解的？\n试试 /about · /projects · /writing，或者直接跟我说话。"
};

const CMD_RESPONSES: Record<string, string> = {
  "/help":
    "可用命令：\n  /about      关于 oii\n  /projects   项目展示\n  /writing    文章 & 分享\n  /hello      打个招呼\n  /clear      清空对话",
  "/about": "好，带你去认识一下 oii —",
  "/projects": "来看看最近在做什么 —",
  "/writing": "去翻翻他写的东西 —",
  "/hello": "嗨嗨！你好呀 :)",
  "/hi": "嗨嗨！你好呀 :)",
  "/ls": "页面路由：/ · /about · /projects · /writing",
  "/sudo rm -rf /": "想得美。此操作已被拒绝，并已记录在案。",
  "/clear": ""
};

const NAV_CMDS: Record<string, string> = {
  "/about": "/about",
  "/projects": "/projects",
  "/writing": "/writing"
};

const FALLBACKS = [
  "嗯……这个我还不太懂，但你可以试试 /help。",
  "这个问题有点难倒我了，输入 /help 看看有什么能帮到你。",
  "我理解你说的，但目前还没法直接回应这个，试试 /about？",
  "收到，不过这超出我的能力范围了 😅  试试斜杠命令。"
];

/** 字体基础样式 */
const mono = "font-mono text-xs leading-relaxed tracking-normal antialiased";

/** grid 布局：固定宽度的前缀列 + 内容列，基线完全对齐 */
const rowGrid = "grid py-0.5" as const;
const COL_STYLE = { gridTemplateColumns: "1.25rem 1fr" } as const;

function AssistantLine({ text }: { text: string }) {
  return (
    <div className={cn(mono, rowGrid)} style={COL_STYLE}>
      <span className="select-none text-[hsl(286_100%_73%)]" aria-hidden>
        ◆
      </span>
      <pre className="min-w-0 whitespace-pre-wrap break-words text-foreground/85 font-[inherit] text-[inherit] leading-[inherit]">
        {text}
      </pre>
    </div>
  );
}

function UserLine({ text }: { text: string }) {
  return (
    <div className={cn(mono, rowGrid)} style={COL_STYLE}>
      <span className="select-none text-muted-foreground/50" aria-hidden>
        ›
      </span>
      <pre className="min-w-0 whitespace-pre-wrap break-words text-muted-foreground font-[inherit] text-[inherit] leading-[inherit]">
        {text}
      </pre>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className={cn(mono, rowGrid)} style={COL_STYLE}>
      <span className="select-none text-[hsl(286_100%_73%)]" aria-hidden>
        ◆
      </span>
      <div className="flex items-center gap-1 self-center">
        <span className="size-1 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:0ms]" />
        <span className="size-1 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:150ms]" />
        <span className="size-1 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:300ms]" />
      </div>
    </div>
  );
}

export function HeroTerminal() {
  const router = useRouter();
  const [lines, setLines] = useState<ChatLine[]>([]);
  const [input, setInput] = useState("");
  const [ready, setReady] = useState(false);
  const [typing, setTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new content
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines, typing]);

  // Greeting on mount with a short delay, then focus input
  useEffect(() => {
    const t = setTimeout(() => {
      setLines([GREETING]);
      setReady(true);
      requestAnimationFrame(() => inputRef.current?.focus());
    }, 400);
    return () => clearTimeout(t);
  }, []);

  const respond = useCallback(
    (userText: string) => {
      const raw = userText.trim();
      const cmd = raw.toLowerCase();

      setLines((prev) => [...prev.slice(-30), { role: "user", text: raw }]);

      if (cmd === "/clear") {
        setTimeout(() => {
          setLines([GREETING]);
        }, 200);
        return;
      }

      setTyping(true);

      const delay = 420 + Math.random() * 180;

      setTimeout(() => {
        setTyping(false);

        const reply =
          CMD_RESPONSES[cmd] ??
          FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)];

        setLines((prev) => [...prev, { role: "assistant", text: reply }]);

        // Re-focus input after AI replies
        requestAnimationFrame(() => inputRef.current?.focus());

        if (NAV_CMDS[cmd]) {
          setTimeout(() => router.push(NAV_CMDS[cmd]), 600);
        }
      }, delay);
    },
    [router]
  );

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const val = input.trim();
    if (!ready || !val || typing) return;
    setInput("");
    // Keep focus in the input immediately after clearing
    requestAnimationFrame(() => inputRef.current?.focus());
    respond(val);
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
      {/* Title bar */}
      <div
        className={cn(
          "flex items-center gap-3 px-4 py-2.5",
          "border-b border-white/[0.06]",
          "bg-[hsl(0_0%_15%)]"
        )}
      >
        <div className="flex gap-2" aria-hidden>
          <span className="size-3 shrink-0 rounded-full bg-[#ff5f57]" />
          <span className="size-3 shrink-0 rounded-full bg-[#febc2e]" />
          <span className="size-3 shrink-0 rounded-full bg-[#28c840]" />
        </div>
        <span
          className={cn(
            mono,
            "min-w-0 flex-1 truncate text-center text-[11px] text-muted-foreground/90 sm:text-xs"
          )}
        >
          oii — chat
        </span>
        <span className="w-[52px] shrink-0 sm:w-[60px]" aria-hidden />
      </div>

      {/* Chat area — fixed height, scroll internally */}
      <div className="flex h-[min(50vh,26rem)] flex-col bg-[hsl(0_0%_9%)]">
        <div
          ref={scrollRef}
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-3"
          role="log"
          aria-live="polite"
          aria-label="对话记录"
        >
          {lines.map((line, i) =>
            line.role === "assistant" ? (
              <AssistantLine key={i} text={line.text} />
            ) : (
              <UserLine key={i} text={line.text} />
            )
          )}
          {typing && <TypingIndicator />}
        </div>

        {/* Input */}
        <form
          onSubmit={onSubmit}
          className={cn(
            mono,
            "flex shrink-0 items-center gap-2.5",
            "border-t border-white/[0.06] px-4 py-3",
            "bg-[hsl(0_0%_9%)] text-foreground/90"
          )}
        >
          <label htmlFor="hero-chat-input" className="sr-only">
            输入消息
          </label>
          <span className="shrink-0 select-none text-[hsl(286_100%_73%)]">
            ›
          </span>
          <input
            id="hero-chat-input"
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            readOnly={!ready}
            className={cn(
              mono,
              "min-w-0 flex-1 border-0 bg-transparent p-0 text-foreground/90",
              "outline-none ring-0 placeholder:text-muted-foreground/50",
              "focus-visible:ring-0",
              !ready && "opacity-40 cursor-not-allowed"
            )}
            placeholder={ready ? "/help · /about · /projects · /writing" : "…"}
            autoComplete="off"
            spellCheck={false}
            aria-label="输入消息或斜杠命令"
          />
          <span className="hidden shrink-0 text-muted-foreground/50 sm:inline">
            ↵
          </span>
          <button type="submit" className="sr-only">
            发送
          </button>
        </form>
      </div>

      <TerminalStatusStrip />
    </div>
  );
}
