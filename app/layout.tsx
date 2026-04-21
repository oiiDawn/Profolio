import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { Footer } from "@/components/layout/footer";
import { Topbar } from "@/components/layout/topbar";

/* 本地字体（node_modules），不经过 next/font 拉 Google，避免网络超时 / AbortError */
import "@fontsource/jetbrains-mono/latin-400.css";
import "@fontsource/jetbrains-mono/latin-700.css";
import "@fontsource/noto-sans-sc/chinese-simplified-400.css";
import "@fontsource/noto-sans-sc/chinese-simplified-500.css";
import "@fontsource/noto-sans-sc/chinese-simplified-700.css";
import "@fontsource/noto-sans-sc/latin-400.css";
import "@fontsource/noto-sans-sc/latin-500.css";
import "@fontsource/noto-sans-sc/latin-700.css";

import "./globals.css";

const siteTitleDefault = "个人主页 · Terminal Architect";
const siteDescription = "自我介绍、成长轨迹与个人分享";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitleDefault,
    template: "%s · Terminal Architect",
  },
  description: siteDescription,
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "OII_DAWN",
    title: siteTitleDefault,
    description: siteDescription,
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitleDefault,
    description: siteDescription,
  },
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="dark">
      <body className="flex min-h-screen flex-col">
        <div
          className="pointer-events-none fixed inset-0 z-[100] scanline-overlay"
          aria-hidden
        />
        <Topbar />
        <main className="flex min-h-0 flex-1 flex-col pt-16">
          {children}
        </main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
