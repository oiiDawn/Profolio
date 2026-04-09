import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "我的个人主页",
  description: "自我介绍与个人分享"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="font-sans">
      <body>{children}</body>
    </html>
  );
}
