import type { Metadata, Viewport } from "next";
import { Inter, Newsreader, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getServerDictionary } from "@/lib/i18n/server";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mandi Price Aggregator",
  description:
    "Real-time agricultural commodity prices across nearby mandis in India.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf9f5" },
    { media: "(prefers-color-scheme: dark)", color: "#1f1e1c" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { locale, dict } = await getServerDictionary();
  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${inter.variable} ${newsreader.variable} ${geistMono.variable}`}
    >
      <body className="min-h-dvh flex flex-col antialiased bg-background text-foreground">
        <ThemeProvider>
          <Header dict={dict} locale={locale} />
          <div className="flex-1 flex flex-col">{children}</div>
          <Footer dict={dict} />
        </ThemeProvider>
      </body>
    </html>
  );
}
