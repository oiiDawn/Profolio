import type { ReactNode } from "react";

/** 全站页面共用：电路背景 + 最小高度；顶栏由 layout 提供 */
export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-[calc(100vh-4rem)]">
      <div className="circuit-bg pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
