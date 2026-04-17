import type { ReactNode } from "react";

import { CircuitBackdrop } from "@/components/circuit-backdrop";

type PageShellProps = {
  children: ReactNode;
};

/** 全站页面共用：电路背景（指针附近高亮）；随 main 的 flex-1 撑满剩余高度，顶栏由 layout 提供 */
export function PageShell({ children }: PageShellProps) {
  return (
    <div className="relative flex w-full flex-1 flex-col min-h-0">
      <CircuitBackdrop />
      <div
        className="scanline-overlay pointer-events-none fixed inset-0 z-[1]"
        aria-hidden
      />
      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        {children}
      </div>
    </div>
  );
}
