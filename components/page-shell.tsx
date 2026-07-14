import type { ReactNode } from "react";

type PageShellProps = {
  children: ReactNode;
};

export function PageShell({ children }: PageShellProps) {
  return (
    <div className="flex w-full flex-1 flex-col min-h-0">
      {children}
    </div>
  );
}
