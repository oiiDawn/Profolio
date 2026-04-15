import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex min-h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-none border border-transparent px-2 py-0.5 font-mono text-xs font-medium uppercase tracking-[0.14em] whitespace-nowrap transition-all focus-terminal aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/85",
        secondary: "bg-secondary text-foreground hover:bg-secondary/80",
        destructive:
          "bg-destructive/15 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 hover:bg-destructive/20",
        outline:
          "border-border/80 text-foreground hover:bg-muted hover:text-muted-foreground",
        ghost:
          "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        link: "text-primary underline-offset-4 hover:underline",
        label:
          "border-accent/20 bg-accent/10 text-accent shadow-[0_0_24px_-14px_rgb(var(--neon-purple)_/_0.45)]",
        meta:
          "border-border/60 bg-[hsl(var(--surface-soft))]/70 text-[hsl(var(--meta-foreground))]",
        terminal:
          "border-primary/18 bg-primary/12 text-primary shadow-[0_0_24px_-14px_rgb(var(--neon-cyan)_/_0.4)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
