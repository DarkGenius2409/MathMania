"use client";

import { usePathname } from "next/navigation";
import type React from "react";
import type { Metadata } from "next";
import { Fredoka } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Navigation } from "@/components/navigation";
import { Suspense } from "react";
import { AuthProvider } from "@/contexts/auth-provider";
import { AuthGuard } from "@/components/auth-guard";
import { AccessibilityProvider } from "@/contexts/accessibility-provider";
import "./globals.css";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-fredoka",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";

  return (
    <html lang="en" className={fredoka.variable}>
      <body className="font-sans antialiased">
        <AuthProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <AccessibilityProvider>
              {!isLandingPage && <Navigation />}
              <AuthGuard>
                <main className="min-h-screen">{children}</main>
              </AuthGuard>
              <Analytics />
            </AccessibilityProvider>
          </Suspense>
        </AuthProvider>
      </body>
    </html>
  );
}
