'use client';

import { useState } from 'react';
import { Activity, Dumbbell, LayoutDashboard, Settings, Utensils, Waves, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { Toaster } from 'sonner';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Surf Status', href: '/surf', icon: Waves },
    { name: 'Dieta & Marmitas', href: '/dieta', icon: Utensils },
    { name: 'Progresso', href: '/treino', icon: Dumbbell },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar Dinâmico */}
      <aside 
        className={`fixed inset-y-0 left-0 bg-zinc-950 border-r border-zinc-800 flex flex-col transition-all duration-300 z-50 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className="h-16 flex items-center px-6 border-b border-zinc-800">
          <Activity className="h-6 w-6 text-emerald-500 shrink-0" />
          <span className={`font-bold text-lg tracking-tight bg-linear-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent ml-2 transition-opacity duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
            BioCore OS
          </span>
        </div>
        
        <nav className="flex-1 px-3 py-8 space-y-1.5 overflow-y-auto overflow-x-hidden">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link 
                key={item.href} 
                href={item.href} 
                title={isCollapsed ? item.name : undefined}
                className={`flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all ${
                  isActive 
                    ? 'bg-zinc-900 text-zinc-50 border border-zinc-800 shadow-sm' 
                    : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-50 border border-transparent'
                }`}
              >
                <Icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-emerald-400' : ''}`} />
                <span className={`ml-3 whitespace-nowrap transition-opacity duration-300 ${isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100 block'}`}>
                  {item.name}
                </span>
              </Link>
            )
          })}
        </nav>

        <div className="p-3 border-t border-zinc-800 space-y-2">
          <Link 
            href="/perfil" 
            title={isCollapsed ? "Biometria & Perfil" : undefined}
            className={`flex items-center px-3 py-3 text-sm font-medium rounded-xl text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-50 transition-colors border border-transparent ${pathname === '/perfil' ? 'bg-zinc-900 text-zinc-50 border-zinc-800' : ''}`}
          >
             <Settings className="h-5 w-5 shrink-0" />
             <span className={`ml-3 whitespace-nowrap transition-opacity duration-300 ${isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100 block'}`}>
              Biometria & Perfil
            </span>
          </Link>

          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center justify-center w-full py-2.5 text-zinc-500 hover:text-zinc-300 transition-colors rounded-xl hover:bg-zinc-900/50"
          >
            {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            <span className={`text-xs ml-2 font-medium transition-opacity duration-300 ${isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100 block'}`}>
              Recolher Menu
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content Área */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
          <Toaster theme="dark" position="bottom-right" richColors />
        </main>
      </div>
    </div>
  );
}
