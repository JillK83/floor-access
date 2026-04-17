import type { Metadata } from "next";
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import "./globals.css";

export const metadata: Metadata = {
  title: "Missed Connection | Asian Barn",
  description: "SMS concierge for Asian Barn furniture shop.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased bg-matte-black text-white`}
      >
        {children}
      </body>
    </html>
  );
}
