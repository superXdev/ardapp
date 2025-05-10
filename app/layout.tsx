import type { Metadata } from "next";
import "./globals.css";
import { AppKit } from "./context/appkit";

export const metadata: Metadata = {
   title: "Arda | Arsip Drama",
   description: "Arsip Drama",
};

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="en">
         <body suppressHydrationWarning>
            <AppKit>{children}</AppKit>
         </body>
      </html>
   );
}
