import Link from "next/link";

import { Separator } from "@/components/ui/separator";
import { siteOwner } from "@/lib/site";

import { ContactLinksNav } from "./contact-links-nav";

export function Footer() {
  return (
    <footer className="border-t bg-background px-4 py-6 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} {siteOwner}
        </p>
        <ContactLinksNav className="flex flex-wrap gap-x-4 gap-y-1" />
      </div>
    </footer>
  );
}
