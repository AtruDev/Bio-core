'use client'

import { useState } from 'react'
import { LayoutGrid, List, Calendar } from 'lucide-react'

export function MealPlannerView({ groupedMeals, dates }: { groupedMeals: any, dates: string[] }) {
  const [viewMode, setViewMode] = useState<'expandida' | 'compacta'>('expandida')

  if (dates.length === 0) {
    return (
      <div className="mt-10">
        <h2 className="text-xl font-bold text-zinc-100 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-cyan-500" /> Cardápio da Semana
        </h2>
        <div className="text-center py-20 bg-zinc-900 border border-zinc-800 border-dashed rounded-3xl">
            <UtensilsGhostIcon className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
            <h3 className="text-zinc-300 font-medium">Nenhuma dieta planejada</h3>
            <p className="text-zinc-500 text-sm mt-1 max-w-sm mx-auto">Sua semana está vazia. Clique acima para que a IA estruture sua nutrição perfeitamente baseada nos seus macros.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <h2 className="text-xl font-bold text-zinc-100 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-cyan-500"/> Cardápio da Semana
        </h2>
        
        {/* Toggle View */}
        <div className="flex items-center bg-zinc-900 border border-zinc-800 p-1 rounded-lg self-start sm:self-auto">
          <button 
            onClick={() => setViewMode('compacta')}
            className={`flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              viewMode === 'compacta' ? 'bg-zinc-800 text-zinc-100 shadow-xs' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <LayoutGrid className="w-4 h-4 mr-2" /> Blocos Compactos
          </button>
          <button 
            onClick={() => setViewMode('expandida')}
            className={`flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              viewMode === 'expandida' ? 'bg-zinc-800 text-zinc-100 shadow-xs' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <List className="w-4 h-4 mr-2" /> Lista Expandida
          </button>
        </div>
      </div>

      {viewMode === 'expandida' ? (
        /* VISÃO EXPANDIDA (Kanban Horizontal Scroll) */
        <div className="flex gap-6 overflow-x-auto pb-6 snap-x">
          {dates.map((date) => {
            const dayMeals = groupedMeals[date];
            const dateObj = new Date(date + "T12:00:00Z");
            const dayName = new Intl.DateTimeFormat('pt-BR', { weekday: 'long' }).format(dateObj);
            const shortDate = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short' }).format(dateObj);

            return (
              <div key={date} className="min-w-[320px] max-w-[340px] bg-zinc-900/50 border border-zinc-800 rounded-2xl flex flex-col snap-start">
                <div className="px-5 py-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-800/20 rounded-t-2xl">
                  <span className="font-bold text-zinc-200 capitalize">{dayName}</span>
                  <span className="text-xs text-zinc-400 bg-zinc-800 px-2 py-1 rounded-md">{shortDate}</span>
                </div>
                
                <div className="p-4 space-y-4 flex-1">
                  {dayMeals.map((meal: any, i: number) => (
                    <div key={i} className="bg-zinc-950 border border-zinc-800/80 p-4 rounded-xl hover:border-cyan-500/30 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                         <h4 className="font-semibold text-zinc-100 leading-tight pr-2">{meal.refeicao_nome}</h4>
                         <span className="text-xs font-bold text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded-full border border-orange-400/20 shrink-0">{meal.calorias} kcal</span>
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed mb-4">{meal.descricao}</p>
                      
                      <div className="flex items-center space-x-3 text-[10px] text-zinc-500">
                        <div className="flex items-center"><span className="text-blue-400 mr-1 font-bold">P</span> {meal.proteinas}g</div>
                        <div className="flex items-center"><span className="text-emerald-400 mr-1 font-bold">C</span> {meal.carboidratos}g</div>
                        <div className="flex items-center"><span className="text-amber-400 mr-1 font-bold">G</span> {meal.gorduras}g</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* VISÃO COMPACTA (Grid multi-linhas, sem scroll horizontal e sem descrição) */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {dates.map((date) => {
            const dayMeals = groupedMeals[date];
            const dateObj = new Date(date + "T12:00:00Z");
            const dayName = new Intl.DateTimeFormat('pt-BR', { weekday: 'long' }).format(dateObj);
            const shortDate = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short' }).format(dateObj);

            return (
              <div key={date} className="bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col">
                <div className="px-4 py-3 border-b border-zinc-800 flex justify-between items-center bg-zinc-800/20 rounded-t-2xl">
                  <span className="font-bold text-zinc-200 capitalize text-sm">{dayName}</span>
                  <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">{shortDate}</span>
                </div>
                
                <div className="p-3 space-y-2 flex-1 flex flex-col justify-center">
                  {dayMeals.map((meal: any, i: number) => (
                    <div key={i} className="bg-zinc-950 border border-zinc-800/50 p-3 rounded-lg flex flex-col justify-center hover:bg-zinc-900 transition-colors">
                      <div className="flex justify-between items-center">
                         <h4 className="font-medium text-sm text-zinc-200 line-clamp-1">{meal.refeicao_nome}</h4>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                         <span className="text-xs font-bold text-orange-400">{meal.calorias} kcal</span>
                         <div className="flex items-center space-x-2 text-[10px]">
                           <span className="text-blue-400 font-medium">P{meal.proteinas}</span>
                           <span className="text-emerald-400 font-medium">C{meal.carboidratos}</span>
                           <span className="text-amber-400 font-medium">G{meal.gorduras}</span>
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function UtensilsGhostIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
      <path d="M7 2v20" />
      <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
    </svg>
  )
}
