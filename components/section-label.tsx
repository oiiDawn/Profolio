import { cn } from "@/lib/utils";

export function SectionLabel({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "text-xs font-medium uppercase tracking-widest text-muted-foreground",
        className
      )}
    >
      {children}
    </p>
  );
}
