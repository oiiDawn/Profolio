import Link from "next/link";

const navLink =
  "text-[10px] font-medium tracking-[0.28em] text-white/60 transition-colors hover:text-white focus-visible:text-white focus-visible:outline-none";

export function Topbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 h-16 border-b border-white/10 bg-[#031326]/88 text-white backdrop-blur-xl">
      <nav
        className="mx-auto grid h-full max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-8"
        aria-label="主页导航"
      >
        <div className="flex gap-5 sm:gap-10">
          <Link className={navLink} href="/about">
            ABOUT
          </Link>
          <Link className={navLink} href="/work">
            WORK
          </Link>
        </div>
        <Link
          href="/"
          className="font-[Georgia] text-xl font-normal tracking-[-0.065em] text-white"
          aria-label="返回主页"
        >
          OII
        </Link>
        <div className="flex justify-end gap-5 sm:gap-10">
          <a
            className={navLink}
            href="https://github.com/oiidawn"
            target="_blank"
            rel="noopener noreferrer"
          >
            GITHUB
          </a>
          <a
            className={`${navLink} hidden sm:inline`}
            href="mailto:oii.zhangjm@gmail.com"
          >
            CONTACT
          </a>
        </div>
      </nav>
    </header>
  );
}
