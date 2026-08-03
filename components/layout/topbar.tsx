import Link from "next/link";

export function Topbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 h-20 text-white">
      <nav
        className="mx-auto grid h-full w-full max-w-6xl grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-8"
        aria-label="Primary navigation"
      >
        <div className="flex gap-4 sm:gap-12">
          <Link
            className="text-[9px] font-medium tracking-[.34em] text-white/55 hover:text-gold focus-visible:text-gold focus-visible:outline-none"
            href="/#about"
          >
            ABOUT
          </Link>
          <Link
            className="text-[9px] font-medium tracking-[.34em] text-white/55 hover:text-gold focus-visible:text-gold focus-visible:outline-none"
            href="/#work"
          >
            WORK
          </Link>
        </div>
        <Link
          href="/#home"
          className="relative border-x border-white/10 px-4 font-display text-2xl font-normal tracking-[-.08em] text-white sm:px-6"
          aria-label="Home"
        >
          OII
          <span
            className="absolute bottom-[-.5rem] left-1/2 h-px w-4 -translate-x-1/2 bg-gold"
            aria-hidden
          />
        </Link>
        <div className="flex justify-end gap-4 sm:gap-12">
          <Link
            className="text-[9px] font-medium tracking-[.34em] text-white/55 hover:text-gold focus-visible:text-gold focus-visible:outline-none"
            href="/#contact"
          >
            CONTACT
          </Link>
        </div>
      </nav>
    </header>
  );
}
