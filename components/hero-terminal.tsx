"use client";

import { useRouter } from "next/navigation";
import {
  type FormEvent,
  type KeyboardEvent,
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

export type TerminalFallbackPicker = (randomValue: number) => string;

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

export function normalizeTerminalInput(value: string) {
  return value.trim();
}

export function getTerminalNavigationTarget(cmd: string) {
  return NAV_CMDS[cmd];
}

export function pickTerminalFallback(
  randomValue: number,
  picker: TerminalFallbackPicker = (value) => {
    const index = Math.floor(value * FALLBACKS.length);
    return FALLBACKS[index] ?? FALLBACKS[0];
  }
) {
  return picker(randomValue);
}

export function resolveTerminalReply(cmd: string, randomValue: number) {
  return CMD_RESPONSES[cmd] ?? pickTerminalFallback(randomValue);
}

export function getTerminalReplyDelayMs(randomValue: number) {
  return 420 + randomValue * 180;
}

/** 字体基础样式 */
const mono = "font-mono text-xs leading-relaxed tracking-normal antialiased";

/** grid 布局：固定宽度的前缀列 + 内容列，基线完全对齐 */
const rowGrid = "grid py-0.5" as const;
const COL_STYLE = { gridTemplateColumns: "1.25rem 1fr" } as const;

function AssistantLine({ text }: { text: string }) {
  return (
    <div className={cn(mono, rowGrid)} style={COL_STYLE} data-testid="hero-assistant-line">
      <span className="select-none text-accent" aria-hidden>
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
    <div className={cn(mono, rowGrid)} style={COL_STYLE} data-testid="hero-user-line">
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
    <div
      className={cn(mono, rowGrid)}
      style={COL_STYLE}
      role="status"
      aria-label="正在输入"
      data-testid="hero-typing-indicator"
    >
      <span className="select-none text-accent" aria-hidden>
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
  const [lines, setLines] = useState<ChatLine[]>([GREETING]);
  const [input, setInput] = useState("");
  const [ready] = useState(true);
  const [typing, setTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new content
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines, typing]);

  // Focus input on mount after a short delay so the intro animation still breathes.
  useEffect(() => {
    const t = setTimeout(() => {
      requestAnimationFrame(() => inputRef.current?.focus());
    }, 400);
    return () => clearTimeout(t);
  }, []);

  const respond = useCallback(
    (userText: string) => {
      const raw = normalizeTerminalInput(userText);
      const cmd = raw.toLowerCase();

      setLines((prev) => [...prev.slice(-30), { role: "user", text: raw }]);

      if (cmd === "/clear") {
        setTimeout(() => {
          setLines([GREETING]);
        }, 200);
        return;
      }

      setTyping(true);

      const delay = getTerminalReplyDelayMs(Math.random());

      setTimeout(() => {
        setTyping(false);

        const reply = resolveTerminalReply(cmd, Math.random());

        setLines((prev) => [...prev, { role: "assistant", text: reply }]);

        // Re-focus input after AI replies
        requestAnimationFrame(() => inputRef.current?.focus());

        const navigationTarget = getTerminalNavigationTarget(cmd);
        if (navigationTarget) {
          setTimeout(() => router.push(navigationTarget), 600);
        }
      }, delay);
    },
    [router]
  );

  const submitInput = useCallback((rawValue?: string) => {
    const val = (rawValue ?? input).trim();
    if (!ready || !val || typing) return;
    setInput("");
    // Keep focus in the input immediately after clearing
    requestAnimationFrame(() => inputRef.current?.focus());
    respond(val);
  }, [input, ready, respond, typing]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    submitInput();
  };

  const onInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const isComposing =
      e.nativeEvent.isComposing ||
      ("keyCode" in e.nativeEvent && e.nativeEvent.keyCode === 229);

    if (isComposing) {
      return;
    }

    if (e.key !== "Enter") {
      return;
    }

    e.preventDefault();
    submitInput(e.currentTarget.value);
  };

  return (
    <div
      data-testid="hero-terminal"
      role="region"
      aria-label="首页终端交互面板"
      className={cn(
        "group focus-terminal-within w-full overflow-hidden rounded-xl border border-border/70 bg-[hsl(var(--surface-soft))]/92 shadow-[0_12px_40px_rgb(0_0_0/0.45),0_2px_8px_rgb(0_0_0/0.25)] sm:rounded-2xl",
        "outline-none"
      )}
    >
      {/* Title bar */}
      <div className={cn("terminal-bar flex items-center gap-3 px-4 py-2.5")}>
        {/* 交通灯：窗口未聚焦时变灰，focus-within 时还原彩色 */}
        <div className="flex gap-2" aria-hidden>
          <span className="size-3 shrink-0 rounded-full bg-white/20 transition-colors duration-150 group-focus-within:bg-terminal-red" />
          <span className="size-3 shrink-0 rounded-full bg-white/20 transition-colors duration-150 group-focus-within:bg-terminal-yellow" />
          <span className="size-3 shrink-0 rounded-full bg-white/20 transition-colors duration-150 group-focus-within:bg-terminal-green" />
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

      {/* Chat area — fixed height, scroll internally; shorter on lg so home fits one screen */}
      <div className="flex h-[min(50vh,26rem)] flex-col bg-surface-base lg:h-[min(28vh,17rem)] xl:h-[min(30vh,18rem)]">
        <div
          ref={scrollRef}
          data-testid="hero-chat-log"
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
          aria-label="终端命令输入"
          className={cn(
            mono,
            "focus-terminal-within flex shrink-0 items-center gap-2.5 border-t border-border/70 bg-surface-base px-4 py-3 text-foreground/90"
          )}
        >
          <label htmlFor="hero-chat-input" className="sr-only">
            输入消息
          </label>
          <span className="shrink-0 select-none text-accent">›</span>
          <input
            id="hero-chat-input"
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onInputKeyDown}
            className={cn(
              mono,
              "min-w-0 flex-1 border-0 bg-transparent p-0 text-foreground/90 outline-none ring-0 placeholder:text-muted-foreground/50 focus-visible:ring-0",
              !ready && "cursor-not-allowed opacity-40"
            )}
            placeholder={ready ? "/help · /about · /projects · /writing" : "…"}
            autoComplete="off"
            spellCheck={false}
            aria-label="输入消息或斜杠命令"
            data-testid="hero-chat-input"
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
