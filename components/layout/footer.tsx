import { siteOwner } from "@/lib/site";

import { ContactLinksNav } from "./contact-links-nav";

export function Footer() {
  return (
    <footer className="border-t border-cyan-900/40 bg-black px-4 py-8 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
          © {new Date().getFullYear()} {siteOwner} · ALL RIGHTS RESERVED
        </p>
        <ContactLinksNav
          className="flex flex-wrap gap-x-6 gap-y-2"
          itemClassName="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
        />
        <div className="flex items-center gap-2 font-mono text-[10px] text-primary/80">
          <span className="size-2 animate-pulse rounded-full bg-primary shadow-[0_0_8px_#8ff5ff]" />
          <span>SYSTEM_LOG: HELLO_WORLD_SUCCESSFUL</span>
        </div>
      </div>
    </footer>
  );
}
