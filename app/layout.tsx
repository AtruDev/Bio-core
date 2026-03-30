import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Activity, Dumbbell, Home, LayoutDashboard, Settings, Utensils, Waves } from "lucide-react";
import Link from "next/link";
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
      <body className={`${inter.className} min-h-screen bg-zinc-950 text-zinc-50 font-sans flex`}>
        {/* Sidebar */}
        <aside className="w-64 border-r border-zinc-800 bg-zinc-950 flex flex-col fixed inset-y-0 left-0">
          <div className="h-16 flex items-center px-6 border-b border-zinc-800">
            <Activity className="h-6 w-6 text-emerald-500 mr-2" />
            <span className="font-bold text-lg tracking-tight bg-linear-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">BioCore OS</span>
          </div>
          
          <nav className="flex-1 px-4 py-8 space-y-1 overflow-y-auto">
            <Link href="/" className="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg bg-zinc-900 text-zinc-50 border border-zinc-800">
              <LayoutDashboard className="h-4 w-4 mr-3 text-emerald-400" />
              Dashboard
            </Link>
            <Link href="/surf" className="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-50 transition-colors">
              <Waves className="h-4 w-4 mr-3" />
              Surf Status
            </Link>
            <Link href="/dieta" className="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-50 transition-colors">
              <Utensils className="h-4 w-4 mr-3" />
              Dieta & Marmitas
            </Link>
            <Link href="/treino" className="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-50 transition-colors">
              <Dumbbell className="h-4 w-4 mr-3" />
              Progresso
            </Link>
          </nav>

          <div className="p-4 border-t border-zinc-800">
            <Link href="/settings" className="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-50 transition-colors">
              <Settings className="h-4 w-4 mr-3" />
              Configurações
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col pl-64">
          <main className="flex-1 p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
