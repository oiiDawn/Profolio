import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import { Topbar } from "@/components/layout/topbar";

import "./globals.css";

export const metadata: Metadata = {
  title: "OII DAWN",
  description: "Product, code and systems.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className="font-sans antialiased">
        <Topbar />
        <main className="pt-16">{children}</main>
      </body>
    </html>
  );
}
