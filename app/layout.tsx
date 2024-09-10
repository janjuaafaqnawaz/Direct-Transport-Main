import { Footer, Navbar } from "@/components/Index";
import Providers from "./Provider";
import "./globals.css";
import { AutoRefresh } from "@/components/AutoRefresh";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/Direct-Transport-Solutions-2.png" sizes="any" />
      </head>
      <body>
        <Providers>
          <Navbar />
          <section className="min-h-[70vh]">{children}</section>
          <AutoRefresh />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
