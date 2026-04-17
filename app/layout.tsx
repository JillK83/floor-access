import type { Metadata } from "next";
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Playfair_Display, JetBrains_Mono } from 'next/font/google'
import "./globals.css";

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
})

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
        className={`${GeistSans.variable} ${GeistMono.variable} ${playfair.variable} ${jetbrains.variable} font-sans antialiased bg-matte-black text-white`}
      >
        {children}
      </body>
    </html>
  );
}
