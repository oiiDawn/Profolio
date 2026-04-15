import { cn } from "@/lib/utils"

export function SectionLabel({
  children,
  className,
}: {
  children: string
  className?: string
}) {
  return <p className={cn("text-label", className)}>{children}</p>
}
