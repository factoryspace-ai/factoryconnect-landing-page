import type { Metadata } from "next";
import "./globals.css";
import {ClerkProvider} from "@clerk/nextjs";
import { UserCreator } from "@/components/auth/user-creator";
import { Toaster } from "sonner";

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
    <html lang="en">
      <body>
        <ClerkProvider>
          <Toaster />
          {/* <UserCreator /> */}
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
