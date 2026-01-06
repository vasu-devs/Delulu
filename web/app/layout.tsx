import type { Metadata } from "next";
import { Space_Mono, Press_Start_2P } from "next/font/google";
import "./globals.css";

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
});

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-press-start",
});

export const metadata: Metadata = {
  title: "RUPEE ROAST | Financial Reality Check",
  description: "AI-powered spending analysis that doesn't sugarcoat your habits.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${spaceMono.variable} ${pressStart2P.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
