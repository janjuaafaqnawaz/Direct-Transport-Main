"use client";

import { Footer, Navbar } from "@/components/Index";
import Providers from "./Provider";
import "./globals.css";
import { useEffect } from "react";
import { verifyAuthNotNav } from "@/api/firebase/functions/auth";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    verifyAuthNotNav();
  }, []);

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/Direct-Transport-Solutions-2.png" sizes="any" />
      </head>
      <body>
        <Providers>
          <Navbar />
          <section className="min-h-[70vh]">{children}</section>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
