"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";

import { ContactLinksNav } from "./contact-links-nav";

const navItems = [
  { label: "主页", href: "/" },
  { label: "关于", href: "/about" },
  { label: "项目", href: "/projects" },
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
          [CORE_SYSTEM]
        </Link>
        <span className="hidden h-4 w-px bg-white/10 sm:block" aria-hidden />
        <nav
          className="flex flex-wrap items-center gap-2 sm:gap-4"
          aria-label="页面主导航"
        >
          {navItems.map((item) => {
            const active = navIsActive(pathname, item.href);
            return (
              <Button
                key={item.href}
                size="sm"
                variant="ghost"
                className={`nav-link-terminal font-mono ${
                  active
                    ? "border-b-2 border-primary text-primary shadow-[0_1px_0_0_rgb(143_245_255/0.5)]"
                    : ""
                }`}
                render={<Link href={item.href} aria-current={active ? "page" : undefined} />}
              >
                {item.label}
              </Button>
            );
          })}
        </nav>
      </div>
      <ContactLinksNav className="flex max-w-[min(100%,36rem)] flex-wrap items-center justify-end gap-x-3 gap-y-1 sm:gap-x-4" />
    </header>
  );
}
