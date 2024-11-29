import Nav from "@/components/nav";
import "./globals.css";
import { Providers } from "./provider";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
      
        <main className="main-content">
          <Providers>  <Nav></Nav>{children}</Providers>
        </main>
      </body>
    </html>
  );
}
