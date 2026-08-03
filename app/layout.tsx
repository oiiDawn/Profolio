import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import { Topbar } from "@/components/layout/topbar";

import "./globals.css";

export const metadata: Metadata = {
  title: "OII DAWN",
  description: "Creative developer working across product, code and systems.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body>
        <Topbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
