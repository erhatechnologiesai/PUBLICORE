import type { Metadata } from "next";
import "./globals.css";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "PUBLICORE — AI-Native Academic Publishing & Research Ecosystem",
  description:
    "Next-generation academic publishing, peer-review, and research intelligence ecosystem. Transparent peer review, AI screening, and deep scientific discovery.",
  keywords: [
    "academic publishing",
    "peer review",
    "scientific research",
    "AI research assistant",
    "open access",
    "scholarly journal",
  ],
  authors: [{ name: "PUBLICORE Academic Consortium" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-platform-hd text-slate-900 antialiased selection:bg-[#177994]/20 selection:text-[#0B1A2C]">
        {children}
      </body>
    </html>
  );
}
