import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, Inter_Tight } from "next/font/google";
import Script from "next/script";

import { GoogleAnalytics } from "@/components/google-analytics";
import { PageViewTracker } from "@/components/page-view-tracker";

import "./globals.css";

const _fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
});

const _inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const _interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  weight: ["400", "500", "600", "700", "800"],
});

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://superaicoach.com";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "SuperAIcoach — Personal AI Assistant Coaching",
  description:
    "SuperAIcoach helps busy professionals use ChatGPT and Claude as a practical virtual AI assistant for writing, planning, and repetitive admin work through 1:1 coaching.",
  keywords:
    "personal ai assistant, virtual ai assistant, ai coach, personal ai coach, chatgpt coach, claude coach, ai productivity coaching",
  authors: [{ name: "Andrew Levine", url: "https://superaicoach.com" }],
  creator: "SuperAIcoach",
  publisher: "SuperAIcoach",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    title: "SuperAIcoach — Personal AI Assistant Coaching",
    description:
      "SuperAIcoach helps busy professionals use ChatGPT and Claude as a practical virtual AI assistant for writing, planning, and repetitive admin work.",
    siteName: "SuperAIcoach",
  },
  twitter: {
    card: "summary_large_image",
    title: "SuperAIcoach — Personal AI Assistant Coaching",
    description:
      "SuperAIcoach helps busy professionals use ChatGPT and Claude as a practical virtual AI assistant for writing, planning, and repetitive admin work.",
    creator: "@andrewlevine",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      {
        url: "/favicon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: {
      url: "/favicon.svg",
      type: "image/svg+xml",
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${_fraunces.variable} ${_inter.variable} ${_interTight.variable} scroll-smooth motion-reduce:scroll-auto`}
    >
      <Script id="enable-js" strategy="beforeInteractive">
        {`document.documentElement.classList.add('js')`}
      </Script>
      <body className="bg-background font-sans text-foreground antialiased">
        <GoogleAnalytics />
        <PageViewTracker />
        {children}
      </body>
    </html>
  );
}
