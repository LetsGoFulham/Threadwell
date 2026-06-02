import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Tactics Coach",
  description: "AI-powered football tactics and formation advisor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#0a0f0a] text-[#e8f5e8]">{children}</body>
    </html>
  );
}
