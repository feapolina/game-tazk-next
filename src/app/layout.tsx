import { Poppins } from "next/font/google";
import "./globals.css";
import type { Metadata } from "next";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-Poppins",
  weight: "300",
});

export const metadata: Metadata = {
  title: "GameTask",
  description: "Acompanhe seus jogos e suas tarefas",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${poppins.variable}`}>{children}</body>
    </html>
  );
}
