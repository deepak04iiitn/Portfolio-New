import type { Metadata } from "next";
import { Rajdhani, Oswald, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import DesktopGuard from "@/components/ui/DesktopGuard";
import "./globals.css";

const rajdhani = Rajdhani({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-rajdhani",
  display: "swap",
});

const oswald = Oswald({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-oswald",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Deepak Express — Portfolio",
  description:
    "Deepak's interactive portfolio — a railway journey through education, experience, projects, and skills. Software Engineer.",
  keywords: ["Deepak", "Software Engineer", "Portfolio", "React", "Next.js", "TypeScript"],
  authors: [{ name: "Deepak" }],
  openGraph: {
    title: "Deepak Express — Portfolio",
    description: "Board the Deepak Express — an interactive railway journey through a software engineering career.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${rajdhani.variable} ${oswald.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <DesktopGuard />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
