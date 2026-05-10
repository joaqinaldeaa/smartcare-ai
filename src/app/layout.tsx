import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Manrope, Fira_Code } from "next/font/google";
import { LanguageProvider } from "@/lib/i18n/context";
import { ThemeProvider } from "@/lib/theme-provider";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const firaCode = Fira_Code({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SmartCare AI - Deteksi Dini Autisme & ADHD",
  description: "Platform deteksi dini risiko Autisme & ADHD berbasis AI. Cepat, aman, dan dapat dilakukan dari rumah.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" data-theme="landing" data-scroll-behavior="smooth" className={`${plusJakartaSans.variable} ${manrope.variable} ${firaCode.variable}`}>
      <body className="min-h-screen font-body antialiased">
        <ThemeProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
