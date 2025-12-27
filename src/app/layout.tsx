import { Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/theme-provider";
import type { Metadata } from "next";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-Poppins",
  weight: "300",
});

export const metadata: Metadata = {
  title: "Nebula",
  description: "Acompanhe seus jogos e suas tarefas",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${poppins.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
