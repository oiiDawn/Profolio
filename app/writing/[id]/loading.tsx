import { PageShell } from "@/components/page-shell";
import { Badge } from "@/components/ui/badge";

export default function Loading() {
  return (
    <PageShell>
      <article
        className="relative px-4 py-16 sm:px-8 lg:py-20"
        data-testid="writing-article-loading"
        aria-busy="true"
      >
        <div className="mx-auto max-w-3xl animate-pulse">
          <div className="mb-8 h-4 w-28 rounded bg-white/10" />
          <Badge variant="outline" className="mb-4">
            LOADING
          </Badge>
          <div className="mt-4 h-12 w-2/3 rounded bg-white/10" />
          <div className="mt-4 h-4 w-32 rounded bg-white/10" />
          <div className="mt-6 h-5 w-full rounded bg-white/10" />
          <div className="mt-2 h-5 w-5/6 rounded bg-white/10" />
          <div className="mt-12 space-y-4">
            <div className="h-5 w-full rounded bg-white/10" />
            <div className="h-5 w-full rounded bg-white/10" />
            <div className="h-5 w-4/5 rounded bg-white/10" />
            <div className="h-28 w-full rounded bg-white/10" />
            <div className="h-5 w-full rounded bg-white/10" />
            <div className="h-5 w-3/4 rounded bg-white/10" />
          </div>
        </div>
      </article>
    </PageShell>
  );
}
