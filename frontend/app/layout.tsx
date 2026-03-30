import type { Metadata } from "next";
import "@/app/globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ToastProvider } from "@/components/ToastProvider";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";

export const metadata: Metadata = {
  title: "Amazon Clone",
  description: "Full stack e-commerce application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <CartProvider>
          <WishlistProvider>
            <Navbar />
            <main className="flex-grow bg-amazon-background">
              {children}
            </main>
            <Footer />
            <ToastProvider />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
