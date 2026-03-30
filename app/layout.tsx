import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClientLayout } from "@/components/ClientLayout";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BioCore OS",
  description: "Dashboard premium para acompanhamento de Surf, Treinos e Dieta",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark h-full">
      <body className={`${inter.className} min-h-screen bg-zinc-950 text-zinc-50 font-sans`}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
