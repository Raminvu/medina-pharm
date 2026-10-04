import type { Metadata } from "next";
import { Inter } from "next/font/google";

import Header from "@/components/layout/header";
import MobileBottomNav from "@/components/layout/mobile-bottom-nav";
import { CartProvider } from "@/components/providers/cart-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "Medina Pharm — Витамины и БАДы",
  description:
    "Витамины, минералы и биологически активные добавки для ежедневной поддержки.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${inter.variable} font-sans antialiased`}>
        <CartProvider>
          <Header />

          <div className="pb-20 lg:pb-0">
            {children}
          </div>

          <MobileBottomNav />
        </CartProvider>
      </body>
    </html>
  );
}