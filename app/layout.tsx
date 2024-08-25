import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NextAuthProvider from "@/providers/nextauthProvider";

import "./globals.css";
import Navbar from "../components/navbar";
import ToastLayout from "@/components/toastLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chatbot (using Gemini)",
  description: "Generated by Vercel Ai-SDK",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <script src="https://unpkg.com/flowbite@1.5.3/dist/flowbite.js"></script>
        <NextAuthProvider>
          <Navbar />
          <div  className="relative top-10">{children}</div>
          <ToastLayout />
        </NextAuthProvider>
      </body>
    </html>
  );
}
