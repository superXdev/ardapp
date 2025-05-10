import type { Metadata } from "next";
import "./globals.css";

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
         <body suppressHydrationWarning>{children}</body>
      </html>
   );
}
