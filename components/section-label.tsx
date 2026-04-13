import { cn } from "@/lib/utils";

export function SectionLabel({
  children,
  className
}: {
  children: string;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "font-mono text-[10px] uppercase tracking-[0.35em] text-[hsl(286_100%_73%)]",
        className
      )}
    >
      {children}
    </p>
  );
}
