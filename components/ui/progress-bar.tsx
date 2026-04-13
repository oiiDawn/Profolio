import { cn } from "@/lib/utils";

export interface ProgressBarProps {
  /** 0–100 */
  value: number;
  className?: string;
  "aria-label"?: string;
}

export function ProgressBar({ value, className, "aria-label": ariaLabel }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, Number.isFinite(value) ? value : 0));

  return (
    <div
      className={cn(
        "h-2 w-full overflow-hidden rounded-none border border-white/10 bg-[hsl(0_0%_12%)]",
        className
      )}
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={ariaLabel ?? "进度"}
    >
      <div
        className="h-full origin-left rounded-none bg-primary shadow-[0_0_12px_rgb(143_245_255/0.35)] transition-[width] duration-300 ease-out"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
