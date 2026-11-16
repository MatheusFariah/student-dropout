import type { Metadata } from "next";
import type { ReactNode } from "react";

import { Manrope } from "next/font/google";

import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "nochurn",
    template: "%s | nochurn",
  },
  description:
    "Plataforma de análise e previsão de risco de evasão acadêmica.",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR">
      <body
        className={`${manrope.variable} min-h-svh bg-[#f7f9fc] font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}