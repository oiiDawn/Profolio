import Link from "next/link";

const navLink =
  "text-[9px] font-medium tracking-[0.34em] text-white/55 transition-colors hover:text-[#cdb27a] focus-visible:text-[#cdb27a] focus-visible:outline-none";

export function Topbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 h-20 text-white">
      <nav
        className="mx-auto grid h-full max-w-6xl grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-8"
        aria-label="Primary navigation"
      >
        <div className="flex gap-4 sm:gap-12">
          <Link className={navLink} href="/about">
            ABOUT
          </Link>
          <Link className={navLink} href="/work">
            WORK
          </Link>
        </div>
        <Link
          href="/"
          className="relative border-x border-white/10 px-4 font-[Didot,Georgia,serif] text-2xl font-normal tracking-[-0.08em] text-white sm:px-6"
          aria-label="Home"
        >
          OII
          <span
            className="absolute -bottom-2 left-1/2 h-px w-4 -translate-x-1/2 bg-[#cdb27a]"
            aria-hidden
          />
        </Link>
        <div className="flex justify-end gap-4 sm:gap-12">
          <a
            className={`${navLink} hidden sm:inline`}
            href="https://github.com/oiidawn"
            target="_blank"
            rel="noopener noreferrer"
          >
            GITHUB
          </a>
          <Link className={navLink} href="/contact">
            CONTACT
          </Link>
        </div>
      </nav>
    </header>
  );
}
