import "../styles/globals.css";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import type { Metadata } from "next";

const displayFont = Fraunces({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-display",
});

const uiFont = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ui",
});

const monoFont = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Ship",
  description: "Your agents. Your rules. Ship faster.",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: ["/favicon.ico"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-deep-navy text-warm-white">
      <body
        className={`${displayFont.variable} ${uiFont.variable} ${monoFont.variable} font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
