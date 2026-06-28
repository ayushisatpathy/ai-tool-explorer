import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { RealtimeBanner } from "@/components/RealtimeBanner";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Tool Explorer",
  description: "Discover and explore the best AI tools, curated and updated automatically.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geist.className} bg-gray-50 min-h-screen antialiased`}>
        <Navbar />
        <RealtimeBanner />
        <main>{children}</main>
      </body>
    </html>
  );
}
