import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import { AuthProvider } from "@/context/AuthContext";
import { SocketProvider } from "@/context/SocketContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Resaleo - Buy & Sell Quality Used Goods",
  description: "The best place to buy and sell second-hand items in your neighborhood.",
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <SocketProvider>
            {children}
            <MobileBottomNav />
            <div className="mb-20 md:mb-0"> {/* Spacer for mobile nav */}
              <Footer />
            </div>
          </SocketProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
