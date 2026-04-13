import Link from "next/link";
import type { ComponentPropsWithoutRef, HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

function slugifyHeading(children: ReactNode): string {
  const text = flattenText(children)
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\u4e00-\u9fff-]/g, "");
  return text || "section";
}

function flattenText(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(flattenText).join("");
  if (typeof node === "object" && "props" in node && node.props) {
    const p = node.props as { children?: ReactNode };
    return flattenText(p.children);
  }
  return "";
}

function makeHeading(Tag: "h1" | "h2" | "h3" | "h4") {
  return function Heading({
    className,
    children,
    ...rest
  }: HTMLAttributes<HTMLHeadingElement>) {
    const id = slugifyHeading(children);
    return (
      <Tag
        id={id}
        className={cn(
          "scroll-mt-24 font-heading font-bold tracking-tight text-foreground",
          Tag === "h1" && "mb-6 text-3xl sm:text-4xl",
          Tag === "h2" &&
          "mt-12 mb-4 border-b border-white/10 pb-2 text-2xl sm:text-3xl",
          Tag === "h3" && "mt-8 mb-3 text-xl sm:text-2xl",
          Tag === "h4" && "mt-6 mb-2 text-lg sm:text-xl",
          className
        )}
        {...rest}
      >
        {children}
      </Tag>
    );
  };
}

export const mdxComponents = {
  h1: makeHeading("h1"),
  h2: makeHeading("h2"),
  h3: makeHeading("h3"),
  h4: makeHeading("h4"),
  p: ({ className, ...props }: ComponentPropsWithoutRef<"p">) => (
    <p
      className={cn("mb-4 leading-relaxed text-muted-foreground", className)}
      {...props}
    />
  ),
  ul: ({ className, ...props }: ComponentPropsWithoutRef<"ul">) => (
    <ul
      className={cn("mb-4 list-disc space-y-2 pl-6 text-muted-foreground", className)}
      {...props}
    />
  ),
  ol: ({ className, ...props }: ComponentPropsWithoutRef<"ol">) => (
    <ol
      className={cn(
        "mb-4 list-decimal space-y-2 pl-6 text-muted-foreground",
        className
      )}
      {...props}
    />
  ),
  li: ({ className, ...props }: ComponentPropsWithoutRef<"li">) => (
    <li className={cn("leading-relaxed", className)} {...props} />
  ),
  blockquote: ({ className, ...props }: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote
      className={cn(
        "mb-4 border-l-2 border-primary/60 bg-primary/5 py-2 pl-4 text-sm text-muted-foreground",
        className
      )}
      {...props}
    />
  ),
  hr: ({ className, ...props }: ComponentPropsWithoutRef<"hr">) => (
    <hr className={cn("my-10 border-white/10", className)} {...props} />
  ),
  a: ({
    href,
    className,
    children,
    ...rest
  }: ComponentPropsWithoutRef<"a">) => {
    if (!href) {
      return (
        <a className={className} {...rest}>
          {children}
        </a>
      );
    }
    const external =
      href.startsWith("http://") ||
      href.startsWith("https://") ||
      href.startsWith("//");
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "text-primary underline decoration-primary/40 underline-offset-4 transition-colors hover:text-accent hover:decoration-accent",
            className
          )}
          {...rest}
        >
          {children}
        </a>
      );
    }
    return (
      <Link
        href={href}
        className={cn(
          "text-primary underline decoration-primary/40 underline-offset-4 transition-colors hover:text-accent hover:decoration-accent",
          className
        )}
      >
        {children}
      </Link>
    );
  },
  code: ({ className, children, ...props }: ComponentPropsWithoutRef<"code">) => {
    const isBlock =
      typeof className === "string" && className.includes("language-");
    if (isBlock) {
      return (
        <code className={cn("font-mono text-sm", className)} {...props}>
          {children}
        </code>
      );
    }
    return (
      <code
        className={cn(
          "rounded-none bg-white/10 px-1.5 py-0.5 font-mono text-[0.9em] text-primary",
          className
        )}
        {...props}
      >
        {children}
      </code>
    );
  },
  pre: ({ className, children, ...props }: ComponentPropsWithoutRef<"pre">) => (
    <pre
      className={cn(
        "mb-6 overflow-x-auto border border-white/10 bg-black/60 p-4 font-mono text-sm leading-relaxed shadow-[0_0_24px_rgb(143_245_255/0.06)]",
        className
      )}
      {...props}
    >
      {children}
    </pre>
  ),
  table: ({ className, ...props }: ComponentPropsWithoutRef<"table">) => (
    <div className="mb-6 w-full overflow-x-auto border border-white/10">
      <table className={cn("w-full border-collapse text-sm", className)} {...props} />
    </div>
  ),
  th: ({ className, ...props }: ComponentPropsWithoutRef<"th">) => (
    <th
      className={cn(
        "border border-white/10 bg-white/5 px-3 py-2 text-left font-mono text-xs uppercase tracking-wider text-primary",
        className
      )}
      {...props}
    />
  ),
  td: ({ className, ...props }: ComponentPropsWithoutRef<"td">) => (
    <td
      className={cn(
        "border border-white/10 px-3 py-2 text-muted-foreground",
        className
      )}
      {...props}
    />
  ),
  img: ({ className, alt, ...props }: ComponentPropsWithoutRef<"img">) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={cn("my-6 max-h-[min(70vh,720px)] w-auto max-w-full border border-white/10", className)}
      alt={alt ?? ""}
      {...props}
    />
  ),
  strong: ({ className, ...props }: ComponentPropsWithoutRef<"strong">) => (
    <strong className={cn("font-semibold text-foreground", className)} {...props} />
  )
};
