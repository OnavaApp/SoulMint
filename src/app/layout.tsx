import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "../providers/providers";
import { Inter } from "next/font/google";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ResponsiveWrapper from "@/components/ResponsiveWrapper"; // ✅ use here
import ScreenProtection from '@/components/ScreenProtection';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Soulmint - Create and Manage Solana Tokens",
  description:
    "Launch your own Solana token with ease using Soulmint. Create, mint, and manage tokens on the Solana blockchain.",
      icons: {
        icon: '/favicon.png',
      },
  };


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <ScreenProtection />
        <Providers>
          <ResponsiveWrapper>
            <Header />
            {children}
            <Footer />
          </ResponsiveWrapper>
        </Providers>
      </body>
    </html>
  );
}
