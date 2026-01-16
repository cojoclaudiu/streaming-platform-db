import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/navbar";
import "./globals.css";
import { NuqsAdapter } from "nuqs/adapters/react";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "StreamPlatform - Filme și Seriale",
  description: "Platformă de streaming cu filme și seriale",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ro">
      <body className={inter.className}>
        <Providers>
          <Navbar />
          <main className="min-h-screen p-6">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
