import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { contactLinks } from "@/lib/site";

export function ContactLinksNav({
  className,
  id,
}: {
  className?: string;
  id?: string;
}) {
  return (
    <nav id={id} className={cn("items-center gap-1", className)} aria-label="联系方式与社交媒体">
      {contactLinks.map((link) => (
        <Button key={link.label} variant="ghost" size="sm" asChild>
          <Link
            href={link.href}
            aria-label={link.ariaLabel}
            target={link.external ? "_blank" : undefined}
            rel={link.external ? "noopener noreferrer" : undefined}
          >
            {link.label}
          </Link>
        </Button>
      ))}
    </nav>
  );
}
