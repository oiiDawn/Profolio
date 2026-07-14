import { PageShell } from "@/components/page-shell";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <PageShell>
      <article
        className="px-4 py-16 sm:px-8 lg:py-20"
        data-testid="writing-article-loading"
        aria-busy="true"
      >
        <div className="mx-auto max-w-3xl">
          <Skeleton className="mb-8 h-4 w-28" />
          <Skeleton className="mb-4 h-5 w-16" />
          <Skeleton className="mt-4 h-12 w-2/3" />
          <Skeleton className="mt-4 h-4 w-32" />
          <Skeleton className="mt-6 h-5 w-full" />
          <Skeleton className="mt-2 h-5 w-5/6" />
          <div className="mt-12 space-y-4">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-4/5" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-3/4" />
          </div>
        </div>
      </article>
    </PageShell>
  );
}
