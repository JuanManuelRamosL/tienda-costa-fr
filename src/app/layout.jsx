import Nav from "@/components/nav";
import "./globals.css";
import { Providers } from "./provider";
import Head from "next/head";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <Head>
          <link rel="icon" href="/logo.ico"/>
        </Head>
      </head>
      <body>
        <main className="main-content">
          <Providers>
            {" "}
            <Nav></Nav>
            {children}
          </Providers>
        </main>
      </body>
    </html>
  );
}
