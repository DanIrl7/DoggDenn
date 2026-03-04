import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import {
  ClerkProvider
} from '@clerk/nextjs'
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PageTransition from "./components/PageTransition";
import { ToastProvider } from "./components/ToastProvider";
import NavigationLoader from "./components/NavigationLoader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DoggDenn",
  description: "All your doggy needs in one shop",
  icons: {
    icon:"/logo.png"
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ToastProvider>
          <PageTransition />
          <Suspense fallback={null}>
            <NavigationLoader />
          </Suspense>
          <Navbar />
          {children}
          <Footer />
        </ToastProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}
