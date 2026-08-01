import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { I18nProvider } from "@/components/providers/I18nProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LoadingScreen from "@/components/effects/LoadingScreen";
import ScrollProgress from "@/components/effects/ScrollProgress";
import CustomCursor from "@/components/effects/CustomCursor";
import { profile } from "@/content";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: profile.seo.title,
  description: profile.seo.description,
  keywords: [...profile.seo.keywords],
  authors: [{ name: profile.name, url: profile.contact.telegramUrl }],
  creator: profile.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    title: profile.seo.title,
    description: profile.seo.description,
    siteName: `${profile.name} Portfolio`,
  },
  twitter: {
    card: "summary_large_image",
    title: profile.seo.title,
    description: profile.seo.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f0fdf4" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0f0a" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="bg-[#f0fdf4] dark:bg-[#0a0f0a] text-gray-900 dark:text-white antialiased selection:bg-green-200 dark:selection:bg-green-800/50 selection:text-green-900 dark:selection:text-green-100">
        <ThemeProvider>
          <I18nProvider>
            <LoadingScreen />
            <ScrollProgress />
            <CustomCursor />
            <Navbar />
            <main id="main-content" role="main">
              {children}
            </main>
            <Footer />
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
