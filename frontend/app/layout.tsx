import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import Providers from "../components/Providers";
import WhatsAppButton from "../components/WhatsAppButton";
import FacebookPixel from "../components/FacebookPixel";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Experience Club - E-commerce Moderno",
  description:
    "Descubra as melhores ofertas em perfumes, maquiagem e muito mais",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Experience Club",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#10b981",
};

// Force dynamic rendering to fix useSearchParams() errors during build
export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={`${inter.className} bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300`}
      >
        <FacebookPixel />
        <Providers>
          <Navigation />
          <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {children}
          </main>
          <Footer />
          <WhatsAppButton />
        </Providers>
      </body>
    </html>
  );
}
