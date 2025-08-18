import type { Metadata } from "next";
import { Geist, Geist_Mono, Lato } from "next/font/google";
import "./globals.css";
import { QueueProvider } from "@/contexts/QueueContext";
import { NameProvider } from "@/contexts/NameContext";
import { GameStateProvider } from "@/contexts/GameStateContext";
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

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
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
        className={`${geistSans.variable} ${geistMono.variable} ${lato.variable} ${lakesight.variable} ${onramp.variable} font-sans antialiased h-screen overflow-hidden`}
      >
        <QueueProvider>
          <NameProvider>
            <GameStateProvider>
              <div className="h-screen flex flex-col overflow-hidden">
                <Header />
                <div className="flex-1 overflow-hidden">
                  {children}
                </div>
              </div>
            </GameStateProvider>
          </NameProvider>
        </QueueProvider>
      </body>
    </html>
  );
}
