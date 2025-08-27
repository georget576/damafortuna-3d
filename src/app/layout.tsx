import type { Metadata } from "next";
import { Shadows_Into_Light, Caveat_Brush, Just_Another_Hand } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import { Toaster } from "sonner";
import Footer from "@/components/Footer";

const shadowsIntoLight = Shadows_Into_Light({
  variable: "--font-shadows-into-light",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  fallback: ["system-ui", "arial", "sans-serif"],
});

const caveatBrush = Caveat_Brush({
  variable: "--font-caveat-brush",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  fallback: ["cursive", "system-ui"],
});

const justAnotherHand = Just_Another_Hand({
  variable: "--font-just-another-hand",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  fallback: ["cursive", "system-ui"],
});

export const metadata: Metadata = {
  title: "DamaFortuna 3D Tarot Reader",
  description: "Experience the mystical world of tarot with our interactive 3D tarot reader",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${shadowsIntoLight.variable} ${caveatBrush.variable} ${justAnotherHand.variable} antialiased font-sans font-fallback`}
      >
        <Providers>
          {children}
          <Footer />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
