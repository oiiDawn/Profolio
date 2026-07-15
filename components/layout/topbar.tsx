"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
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

const sections = [
  { id: "home", label: "主页" },
  { id: "about", label: "关于" },
  { id: "projects", label: "项目" },
] as const;

function DotLink({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button onClick={onClick} className="group flex items-center gap-2">
      <span
        className={cn(
          "h-2 w-2 rounded-full transition-all duration-300",
          active
            ? "bg-primary scale-125"
            : "bg-muted-foreground/30 group-hover:bg-muted-foreground/60"
        )}
      />
      <span
        className={cn(
          "text-xs font-medium transition-colors",
          active
            ? "text-foreground"
            : "text-muted-foreground group-hover:text-foreground"
        )}
      >
        {label}
      </span>
    </button>
  );
}

export function Topbar() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string>("home");
  const isHomePage = pathname === "/";

  const scrollToSection = useCallback((sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (!isHomePage) return;

    const observers: IntersectionObserver[] = [];

    sections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (!element) return;

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) setActiveSection(id);
        },
        { threshold: 0.3, rootMargin: "-80px 0px -40% 0px" }
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [isHomePage]);

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

        {isHomePage ? (
          <>
            <Separator orientation="vertical" className="hidden h-4 sm:block" />
            <nav
              className="hidden items-center gap-3 sm:flex"
              aria-label="页面内导航"
            >
              {sections.map(({ id, label }) => (
                <DotLink
                  key={id}
                  label={label}
                  active={activeSection === id}
                  onClick={() => scrollToSection(id)}
                />
              ))}
            </nav>
          </>
        ) : null}
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href={isHomePage ? "/writing" : "/"}>
            {isHomePage ? "分享" : "首页"}
          </Link>
        </Button>
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
              {isHomePage ? (
                <>
                  {sections.map(({ id, label }) => (
                    <Button
                      key={id}
                      variant={activeSection === id ? "secondary" : "ghost"}
                      className="justify-start"
                      onClick={() => scrollToSection(id)}
                    >
                      {label}
                    </Button>
                  ))}
                  <Separator className="my-2" />
                </>
              ) : null}
              <Button variant="ghost" asChild className="justify-start">
                <Link href={isHomePage ? "/writing" : "/"}>
                  {isHomePage ? "分享" : "首页"}
                </Link>
              </Button>
            </nav>
            <Separator className="my-4" />
            <ContactLinksNav className="flex flex-col gap-2" />
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
