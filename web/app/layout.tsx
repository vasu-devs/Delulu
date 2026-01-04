import type { Metadata } from "next";
import { Outfit, Fraunces } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: "italic",
});

export const metadata: Metadata = {
  title: "Delulu | Financial Reality Journal",
  description: "A gentle, paper-thin journal of your financial indiscretions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} ${fraunces.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
