import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import {ClerkProvider} from "@clerk/nextjs";
import { UserCreator } from "@/components/auth/user-creator";
import { Toaster } from "sonner";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "FactorySpace - Manufacturing Cloud Platform",
  description: "Streamline your manufacturing operations with FactorySpace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <ClerkProvider>
        <html lang="en">
          <body className={`${geistSans.variable} ${geistMono.variable}`}>
            <Toaster />
            <UserCreator />
            {children}
          </body>
        </html>
      </ClerkProvider>
    </>

  );
}
