import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NextAuthProvider from "@/providers/nextauthProvider";

import "./globals.css";
import Navbar from "../components/navbar";
import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthProvider>
          {/* <Suspense fallback={<div className="text-black">Loading...</div>}> */}
          <Navbar />
          {children}
          {/* </Suspense> */}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            transition={Bounce}
          />
        </NextAuthProvider>
      </body>
    </html>
  );
}
