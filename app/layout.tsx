import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { Footer } from "@/components/layout/footer";
import { Topbar } from "@/components/layout/topbar";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "个人主页 · Terminal Architect",
    template: "%s · Terminal Architect"
  },
  description: "自我介绍、成长轨迹与个人分享"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="dark">
      <body className="min-h-screen font-sans">
        <div
          className="pointer-events-none fixed inset-0 z-[100] scanline-overlay"
          aria-hidden
        />
        <Topbar />
        <main className="pt-16">{children}</main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
