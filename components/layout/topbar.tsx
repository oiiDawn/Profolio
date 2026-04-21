"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ContactLinksNav } from "./contact-links-nav";

const navItems = [
  { label: "主页", href: "/" },
  { label: "关于", href: "/about" },
  { label: "项目", href: "/projects" },
  { label: "分享", href: "/writing" }
] as const;

export function navIsActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Topbar() {
  const pathname = usePathname();

  return (
    <header className="terminal-bar fixed top-0 right-0 left-0 z-50 flex h-16 items-center justify-between border-b border-border/60 px-4 shadow-[0_0_30px_rgb(143_245_255/0.05)] backdrop-blur-xl sm:px-6">
      <div className="flex min-w-0 items-center gap-3 md:gap-6">
        <Link
          href="/"
          className="focus-terminal inline-flex items-center transition-[filter] duration-200 hover:filter-[drop-shadow(0_0_10px_rgb(143_245_255/0.45))]"
          aria-label="返回主页"
        >
          {/* 单一事实来源：public/logo-wordmark.svg；plain img 避免 next/image 对 SVG 的额外配置 */}
          {/* eslint-disable-next-line @next/next/no-img-element -- static SVG wordmark from /public */}
          <img
            src="/logo-wordmark.svg"
            alt=""
            width={172}
            height={32}
            className="block h-5 w-auto sm:h-[22px]"
            aria-hidden
          />
        </Link>
        <span className="hidden h-4 w-px bg-white/10 sm:block" aria-hidden />
        <nav
          className="flex min-w-0 flex-wrap items-center gap-1 sm:gap-1.5"
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
                  "focus-terminal relative px-2 py-1.5 font-mono text-xs uppercase tracking-[0.16em] outline-none sm:px-2.5 sm:tracking-[0.18em]",
                  "transition-[color,text-shadow,background-color] duration-200 ease-out",
                  "before:absolute before:bottom-0 before:left-0 before:right-0 before:h-px",
                  "before:bg-primary before:[box-shadow:0_0_8px_2px_rgb(143_245_255/0.45)]",
                  "before:origin-left before:content-['']",
                  "before:transition-[transform,opacity] before:duration-200 before:ease-out",
                  active
                    ? [
                      "bg-primary/6 text-primary [text-shadow:0_0_12px_rgb(143_245_255/0.5)]",
                      "before:scale-x-100 before:opacity-100",
                    ].join(" ")
                    : [
                      "text-muted-foreground text-shadow-none",
                      "hover:bg-primary/5 hover:text-primary/70",
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
      <ContactLinksNav className="hidden max-w-[min(100%,36rem)] items-center justify-end gap-x-3 gap-y-1 sm:flex sm:gap-x-4" />
    </header>
  );
}
