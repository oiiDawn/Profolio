import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/lib/utils";

function slugifyHeading(children: ReactNode): string {
  const text = flattenText(children)
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w一-鿿-]/g, "");
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

function isExternalHref(href: string) {
  return (
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("//")
  );
}

function makeHeading(Tag: "h1" | "h2" | "h3" | "h4") {
  return function Heading({
    className,
    children,
    ...rest
  }: ComponentPropsWithoutRef<"h1">) {
    const id = slugifyHeading(children);
    return (
      <Tag
        id={id}
        className={cn("scroll-mt-24", className)}
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
    const external = isExternalHref(href);
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={className}
          {...rest}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  },
};
