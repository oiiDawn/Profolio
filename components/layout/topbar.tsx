"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { ContactLinksNav } from "./contact-links-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "主页", href: "/" },
  { label: "关于", href: "/about" },
  { label: "项目", href: "/projects" },
  { label: "分享", href: "/writing" },
] as const;

export function navIsActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Topbar() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 right-0 left-0 z-50 flex h-16 items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-4 md:gap-6">
        <Link
          href="/"
          className="font-semibold tracking-tight hover:opacity-80 transition-opacity"
          aria-label="返回主页"
        >
          OII_DAWN
        </Link>
        <Separator orientation="vertical" className="hidden h-4 sm:block" />
        <nav
          className="hidden items-center gap-1 sm:flex"
          aria-label="页面主导航"
        >
          {navItems.map((item) => {
            const active = navIsActive(pathname, item.href);
            return (
              <Button
                key={item.href}
                variant="ghost"
                asChild
                className={cn(
                  "text-sm font-medium",
                  active && "bg-accent text-accent-foreground"
                )}
              >
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </Button>
            );
          })}
        </nav>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <ContactLinksNav className="hidden items-center gap-1 md:flex" />
        <ThemeToggle />
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="sm:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">打开菜单</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetTitle className="sr-only">导航菜单</SheetTitle>
            <nav className="flex flex-col gap-2 mt-6" aria-label="页面主导航">
              {navItems.map((item) => {
                const active = navIsActive(pathname, item.href);
                return (
                  <Button
                    key={item.href}
                    variant={active ? "secondary" : "ghost"}
                    asChild
                    className="justify-start"
                  >
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                    >
                      {item.label}
                    </Link>
                  </Button>
                );
              })}
            </nav>
            <Separator className="my-4" />
            <ContactLinksNav className="flex flex-col gap-2" />
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
