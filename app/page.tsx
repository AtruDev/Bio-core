import { ChevronRight, Dumbbell, Flame, Utensils, Waves, AlertTriangle } from "lucide-react";
import { redirect } from 'next/navigation'
import { createClient } from "@/utils/supabase/server";
import { GenerateDietButton, GenerateWorkoutButton } from "@/components/GenerateButtons";

export default async function DashboardPage() {
  let hasSupabase = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  let user = null;
  let dietPlan: any = null;
  let workoutPlan: any = null;

  if (hasSupabase && process.env.NEXT_PUBLIC_SUPABASE_URL !== 'seu_url_do_supabase_aqui') {
    try {
      const supabase = await createClient();
      const auth = await supabase.auth.getUser();
      user = auth.data.user;

      if (user) {
        // Busca a dieta do dia
        const { data: dietData } = await supabase
          .from("dieta_atual")
          .select("*")
          .eq("user_id", user.id)
          .eq("data_dieta", new Date().toISOString().split("T")[0])
          .order("criado_em", { ascending: false });
        
        if (dietData && dietData.length > 0) dietPlan = dietData;

        // Busca o treino do dia
        const { data: workoutData } = await supabase
          .from("logs_treino")
          .select("*")
          .eq("user_id", user.id)
          .eq("data_treino", new Date().toISOString().split("T")[0])
          .order("criado_em", { ascending: false })
          .limit(1)
          .single();

        if (workoutData) workoutPlan = workoutData;
      }
    } catch (err) {
      console.error("Erro ao conectar no banco:", err);
      hasSupabase = false; // Fallback visual
    }
  } else {
    hasSupabase = false; // Força modo mock se as chaves forem as padrão
  }

  const signOut = async () => {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    return redirect('/login')
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-50">Visão Geral</h1>
          <p className="text-zinc-400 mt-1">Seu resumo diário de Surf, Dieta e Treino.</p>
        </div>
        
        <div className="flex items-center space-x-4">
          {user && (
            <div className="flex items-center space-x-3 text-sm">
              <span className="hidden sm:inline-block text-zinc-400">{user.email}</span>
              <form action={signOut}>
                <button className="bg-zinc-900 border border-zinc-800 hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-400 text-zinc-300 font-medium rounded-lg px-4 py-2 transition-all">
                  Sair
                </button>
              </form>
            </div>
          )}

          {!hasSupabase && (
            <div className="flex items-center space-x-2 text-amber-500 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20 text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>Executando em Modo Mock</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Surf Status Card */}
        <div className="group relative overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 p-6 flex flex-col transition-all hover:shadow-lg hover:shadow-cyan-900/20 hover:border-cyan-500/50">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Waves className="w-24 h-24 text-cyan-400" />
          </div>
          <div className="relative z-10 flex flex-col flex-1">
            <div className="flex items-center space-x-2 text-cyan-400 mb-4">
              <Waves className="w-5 h-5" />
              <h3 className="font-semibold">Status do Surf</h3>
            </div>
            <div className="flex-1">
              <p className="text-3xl font-bold text-zinc-50 mb-1">Pico: Piatã</p>
              <div className="flex items-center justify-start space-x-2 text-sm text-zinc-300 mt-2">
                <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-400 font-medium border border-emerald-500/20">Swell: 1.5m</span>
                <span className="px-2.5 py-1 rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700">Vento: Terral</span>
              </div>
            </div>
            <button className="mt-8 flex items-center text-sm font-medium text-cyan-400 hover:text-cyan-300 group-hover:translate-x-1 transition-transform">
              Ver Condições Completas <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>

        {/* Refeição Atual Card */}
        <div className="group relative overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 p-6 flex flex-col transition-all hover:shadow-lg hover:shadow-emerald-900/20 hover:border-emerald-500/50">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Utensils className="w-24 h-24 text-emerald-400" />
          </div>
          <div className="relative z-10 flex flex-col flex-1">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2 text-emerald-400">
                <Utensils className="w-5 h-5" />
                <h3 className="font-semibold">Refeição Atual</h3>
              </div>
              <span className="text-xs font-semibold bg-zinc-800 text-zinc-300 px-2.5 py-1 rounded-md border border-zinc-700">Ao Vivo</span>
            </div>

            {dietPlan ? (
              <div className="flex-1">
                <p className="text-2xl font-bold text-zinc-50 mb-3">{dietPlan[0].refeicao_nome}</p>
                <div className="space-y-2">
                  <p className="text-sm text-zinc-400 leading-relaxed max-h-24 overflow-y-auto pr-2">{dietPlan[0].descricao}</p>
                </div>
                <div className="mt-5 flex items-center space-x-4 text-xs">
                  <div className="flex items-center text-zinc-300 bg-zinc-950/50 px-2 py-1 rounded-md border border-zinc-800">
                    <Flame className="w-3.5 h-3.5 text-orange-400 mr-1.5"/> {dietPlan[0].calorias} kcal
                  </div>
                  <div className="flex items-center text-zinc-300 bg-zinc-950/50 px-2 py-1 rounded-md border border-zinc-800">
                    <span className="font-bold text-blue-400 mr-1.5">P</span> {dietPlan[0].proteinas}g
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1">
                <p className="text-2xl font-bold text-zinc-50 mb-3">Marmita IA (Almoço)</p>
                <p className="text-sm text-zinc-400 mb-2">Pendente geração para hoje...</p>
              </div>
            )}
            
            <GenerateDietButton />
          </div>
        </div>

        {/* Treino do Dia Card */}
        <div className="group relative overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 p-6 flex flex-col transition-all hover:shadow-lg hover:shadow-orange-900/20 hover:border-orange-500/50">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Dumbbell className="w-24 h-24 text-orange-400" />
          </div>
          <div className="relative z-10 flex flex-col flex-1">
            <div className="flex items-center space-x-2 text-orange-400 mb-4">
              <Dumbbell className="w-5 h-5" />
              <h3 className="font-semibold">Treino do Dia</h3>
            </div>
            
            {workoutPlan ? (
              <div className="flex-1 mt-auto">
                <p className="text-2xl font-bold text-zinc-50">{workoutPlan.tipo_treino}</p>
                <p className="text-sm text-zinc-400 mb-4 line-clamp-2">{workoutPlan.descricao}</p>
                <div className="space-y-3 mt-4">
                  <div className="w-full bg-zinc-950 border border-zinc-800 rounded-full h-2.5 overflow-hidden">
                    <div className="bg-linear-to-r from-orange-500 to-amber-400 h-full rounded-full w-[10%] relative animate-pulse">
                    </div>
                  </div>
                  <p className="text-xs text-zinc-400 text-right font-medium">{workoutPlan.duracao_minutos} minutos ({workoutPlan.intensidade})</p>
                </div>
              </div>
            ) : (
               <div className="flex-1 flex flex-col">
                <p className="text-2xl font-bold text-zinc-50">Treino Pendente</p>
                <p className="text-sm text-zinc-400 mb-6">Aguardando IA calcular...</p>
                 <div className="space-y-3 mt-auto">
                  <div className="w-full bg-zinc-950 border border-zinc-800 rounded-full h-2.5 overflow-hidden"></div>
                </div>
              </div>
            )}

            <GenerateWorkoutButton />
          </div>
        </div>
      </div>
    </div>
  );
}
