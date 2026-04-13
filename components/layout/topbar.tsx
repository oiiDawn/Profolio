"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ContactLinksNav } from "./contact-links-nav";

const navItems = [
  { label: "主页", href: "/" },
  { label: "关于", href: "/about" },
  { label: "项目", href: "/projects" },
  { label: "学习", href: "/learning" },
  { label: "分享", href: "/writing" }
] as const;

function navIsActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Topbar() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 right-0 left-0 z-50 flex h-16 items-center justify-between border-b border-white/5 bg-black/40 px-4 backdrop-blur-xl shadow-[0_0_30px_rgb(143_245_255/0.05)] sm:px-6">
      <div className="flex flex-wrap items-center gap-3 md:gap-6">
        <Link
          href="/"
          className="font-mono text-lg font-black tracking-[-0.05em] text-primary"
          aria-label="返回主页"
        >
          [OII_DAWN]
        </Link>
        <span className="hidden h-4 w-px bg-white/10 sm:block" aria-hidden />
        <nav
          className="flex flex-wrap items-center gap-1 sm:gap-2"
          aria-label="页面主导航"
        >
          {navItems.map((item) => {
            const active = navIsActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={[
                  "relative font-mono text-xs uppercase tracking-widest px-3 py-1.5",
                  "outline-none",
                  "focus-visible:ring-1 focus-visible:ring-primary/50",
                  // text color + glow + bg all transition together
                  "transition-[color,text-shadow,background-color] duration-200 ease-out",
                  // indicator line — always present, animated via scaleX + opacity
                  "before:absolute before:bottom-0 before:left-2 before:right-2 before:h-px",
                  "before:bg-primary before:[box-shadow:0_0_8px_2px_rgb(143_245_255/0.45)]",
                  "before:content-[''] before:origin-left",
                  "before:transition-[transform,opacity] before:duration-200 before:ease-out",
                  active
                    ? [
                      "text-primary [text-shadow:0_0_12px_rgb(143_245_255/0.5)]",
                      "before:scale-x-100 before:opacity-100",
                    ].join(" ")
                    : [
                      "text-muted-foreground text-shadow-none",
                      "hover:text-primary/70 hover:bg-primary/5",
                      "before:scale-x-0 before:opacity-0",
                    ].join(" "),
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <ContactLinksNav className="flex max-w-[min(100%,36rem)] flex-wrap items-center justify-end gap-x-3 gap-y-1 sm:gap-x-4" />
    </header>
  );
}
