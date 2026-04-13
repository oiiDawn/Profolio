"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ChapterStatus, LearningChapter } from "@/lib/types";

function statusDotClass(status: ChapterStatus) {
  switch (status) {
    case "completed":
      return "bg-primary shadow-[0_0_8px_rgb(143_245_255/0.45)]";
    case "in_progress":
      return "bg-[hsl(286_100%_73%)] shadow-[0_0_8px_rgb(213_117_255/0.4)]";
    default:
      return "bg-muted-foreground/40";
  }
}

function statusLabel(status: ChapterStatus) {
  switch (status) {
    case "completed":
      return "已完成";
    case "in_progress":
      return "进行中";
    default:
      return "未开始";
  }
}

export interface LearningChaptersProps {
  chapters: LearningChapter[];
  defaultOpen?: boolean;
}

export function LearningChapters({
  chapters,
  defaultOpen = true
}: LearningChaptersProps) {
  const [open, setOpen] = useState(defaultOpen);

  if (chapters.length === 0) {
    return (
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        暂无章节 · 可在 Supabase 中添加
      </p>
    );
  }

  return (
    <div className="border-t border-white/10 pt-4">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="-ml-2 mb-2 h-auto gap-2 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-primary"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <ChevronDown
          className={cn(
            "size-4 shrink-0 transition-transform duration-200",
            open ? "rotate-0" : "-rotate-90"
          )}
          aria-hidden
        />
        章节列表 ({chapters.length})
      </Button>

      {open ? (
        <ul className="space-y-2" role="list">
          {chapters.map((ch) => {
            const href =
              ch.share_url?.trim() ||
              (ch.share_id
                ? `/writing#share-${encodeURIComponent(ch.share_id)}`
                : null);

            return (
              <li
                key={ch.id}
                className="flex flex-wrap items-start gap-x-3 gap-y-1 border border-white/5 bg-black/20 px-3 py-2"
              >
                <span
                  className={cn(
                    "mt-1.5 size-2 shrink-0 rounded-full",
                    statusDotClass(ch.status)
                  )}
                  title={statusLabel(ch.status)}
                  aria-hidden
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium leading-snug">{ch.title}</p>
                  <p className="font-mono text-[10px] text-muted-foreground">
                    {statusLabel(ch.status)}
                  </p>
                </div>
                {href ? (
                  <Link
                    href={href}
                    className="shrink-0 font-mono text-[10px] uppercase tracking-widest text-primary underline-offset-4 transition-colors hover:underline"
                    {...(href.startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    aria-label={`打开与「${ch.title}」相关的分享`}
                  >
                    分享 →
                  </Link>
                ) : (
                  <span className="shrink-0 font-mono text-[10px] text-muted-foreground/70">
                    未关联分享
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
