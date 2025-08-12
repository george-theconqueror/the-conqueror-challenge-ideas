import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueueProvider } from "@/contexts/QueueContext";
import { NameProvider } from "@/contexts/NameContext";
import { lakesight, onramp } from "@/lib/fonts";
import { Header } from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Conqueror Virtual Challenges Ideas",
  description: "Rank and prioritize future challenge ideas using Elo rating system",
  
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${lakesight.variable} ${onramp.variable} antialiased`}
      >
        <QueueProvider>
          <NameProvider>
            <Header />
            {children}
          </NameProvider>
        </QueueProvider>
      </body>
    </html>
  );
}
