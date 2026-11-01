import type { Metadata, Viewport } from "next";
import { Fraunces, Work_Sans } from "next/font/google";
import "./globals.css";

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin", "latin-ext"],
  axes: ["SOFT", "opsz"],
});

const body = Work_Sans({
  variable: "--font-body",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "Pizza Gianni – pizza s rozvozem, Týnec nad Sázavou",
  description:
    "Pizza Gianni z Týnce nad Sázavou. Objednejte si pizzu s rozvozem online nebo na telefonu 604 164 623.",
};

export const viewport: Viewport = {
  themeColor: "#f3d3b0",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="cs" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
