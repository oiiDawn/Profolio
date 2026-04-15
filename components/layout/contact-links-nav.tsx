import { cn } from "@/lib/utils";
import { contactLinks } from "@/lib/site";

export function ContactLinksNav({
  className,
  id,
  itemClassName
}: {
  className?: string;
  id?: string;
  itemClassName?: string;
}) {
  return (
    <nav id={id} className={className} aria-label="联系方式与社交媒体">
      {contactLinks.map((link) => (
        <a
          key={link.label}
          href={link.href}
          className={cn(
            "text-micro focus-terminal inline-flex items-center px-1 py-1 text-muted-foreground transition-colors hover:text-primary",
            itemClassName
          )}
          aria-label={link.ariaLabel}
          {...(link.external
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}
