import { Montserrat } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";

import Toaster from "./_components/main/CustomToaster";
import { NextAuthProvider } from "./_components/main/NextAuthProvider";
import ProgressBarProvider from "./_components/main/ProgressBarProvider";

import type { Metadata, Viewport } from "next";

import "./globals.css";

const montserrat = Montserrat({ subsets: ["latin"] });

const robots =
  process.env.APP_ENV != "production" ? "noindex, nofollow" : "index, follow";

export const metadata: Metadata = {
  title: {
    default: "Moklet's Organization - SMK Telkom Malang",
    template: "%s | Moklet.org",
  },
  description:
    "A one doorway to explore Moklet's (SMK Telkom Malang) organizations' creativity and innovations",
  keywords:
    "moklet.org, Moklet, Moklet.org, Telkom, SMK, Malang, SMK Telkom Malang",
  authors: { name: "MokletDev", url: "https://dev.moklet.org" },
  creator: "MokletDev Team",
  publisher: "SMK Telkom Malang",
  icons: "https://www.moklet.org/logogram.png",
  openGraph: {
    images: "https://www.moklet.org/horizontal.png",
  },
  robots: robots,
  metadataBase: new URL(process.env.URL || "https://www.moklet.org"),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      {process.env.APP_ENV === "production" && process.env.GA_ID && (
        <GoogleAnalytics gaId={process.env.GA_ID} />
      )}
      <body className={montserrat.className + " overflow-x-hidden"}>
        <NextAuthProvider>
          <Toaster />
          <ProgressBarProvider>{children}</ProgressBarProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}

export const revalidate = 5400;
