import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { Dumbbell, Activity, Flame, Clock } from "lucide-react"
import { GenerateWorkoutButton } from "@/components/GenerateButtons"
import { WorkoutCharts } from "@/components/WorkoutCharts"

export default async function TreinoPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch past workouts (last 30)
  const { data: workouts } = await supabase
    .from('logs_treino')
    .select('*')
    .eq('user_id', user.id)
    .order('criado_em', { ascending: false })
    .limit(30)

  // Estatísticas do Dashboard
  const totalWorkouts = workouts?.length || 0;
  const totalMinutes = workouts?.reduce((acc: number, item: any) => acc + (item.duracao_minutos || 0), 0) || 0;
  let caloriesEst = (totalMinutes * 8); // Chute leve de 8 kcal/min pra treino generico
  
  // Pegar o treino mais recente para Destacar
  const lastWorkout = workouts && workouts.length > 0 ? workouts[0] : null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-50">Seu Progresso de Treino</h1>
          <p className="text-zinc-400 mt-1">Acompanhe sua consistência e volume de preparação física.</p>
        </div>
        <div className="w-full md:w-auto p-3">
          <GenerateWorkoutButton />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mt-8">
        {/* Gráfico de Volume Mensal */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl col-span-1 md:col-span-2 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-zinc-50 font-bold text-lg flex items-center">
                <Activity className="w-5 h-5 mr-2 text-orange-500" />
                Tempo Ativo Recente
              </h2>
              <p className="text-zinc-400 text-sm">Minutos suados sob carga do aplicativo.</p>
            </div>
            <div className="bg-orange-500/10 border border-orange-500/20 text-orange-400 px-3 py-1.5 rounded-lg text-sm font-bold">
               {totalMinutes} min totais
            </div>
          </div>
          <WorkoutCharts data={workouts || []} />
        </div>

        {/* Card Destaques & Status */}
        <div className="flex flex-col space-y-4">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl flex-1 relative overflow-hidden group hover:border-orange-500/30 transition-all">
            <div className="absolute right-0 top-0 opacity-5 p-4">
              <Dumbbell className="w-24 h-24" />
            </div>
            <div className="text-orange-400 font-medium flex items-center space-x-2 mb-4">
              <Dumbbell className="w-4 h-4" /> <span>Treinos Cumpridos</span>
            </div>
            <div className="text-4xl font-black text-zinc-50 mb-1">{totalWorkouts}</div>
            <p className="text-zinc-500 text-sm">sugeridos e salvos pela IA</p>
          </div>
          
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl flex-1 relative overflow-hidden group hover:border-red-500/30 transition-all">
            <div className="absolute right-0 top-0 opacity-5 p-4">
              <Flame className="w-24 h-24" />
            </div>
            <div className="text-red-400 font-medium flex items-center space-x-2 mb-4">
              <Flame className="w-4 h-4" /> <span>Gasto Estimado (Acumulado)</span>
            </div>
            <div className="text-4xl font-black text-zinc-50 mb-1">{caloriesEst} <span className="text-lg text-zinc-400 font-medium">kcal</span></div>
            <p className="text-zinc-500 text-sm">queimadas aproximadamente</p>
          </div>
        </div>
      </div>

      {/* Lista de Histórico Recente */}
      <h2 className="text-xl font-bold text-zinc-100 mt-10 mb-4 flex items-center border-b border-zinc-800 pb-3">
        <Clock className="w-5 h-5 mr-2 text-zinc-400"/> Histórico Detalhado
      </h2>

      {(!workouts || workouts.length === 0) ? (
        <div className="text-center py-20">
           <Dumbbell className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
           <p className="text-zinc-500">Nenhum treino gerado ainda. Clique em Girar Treino Acima!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {workouts.map((treino: any, i: number) => {
            let labelIntensidade = "text-zinc-400 bg-zinc-800";
            if (treino.intensidade.toLowerCase().includes('alta')) labelIntensidade = "text-red-400 bg-red-400/10 border-red-400/20";
            else if (treino.intensidade.toLowerCase().includes('moderada')) labelIntensidade = "text-orange-400 bg-orange-400/10 border-orange-400/20";
            else labelIntensidade = "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";

            // Safely parse dates
            let dateTitle = "Data Desconhecida";
            try {
              const baseDate = treino.data_treino ? (treino.data_treino + "T12:00:00Z") : treino.criado_em;
              const dateObj = new Date(baseDate);
              dateTitle = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' }).format(dateObj);
            } catch(e) {}

            return (
              <div key={treino.id || i} className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between hover:bg-zinc-800/50 transition-colors group">
                <div className="flex max-md:flex-col md:items-center md:space-x-6">
                  {/* Icon Block */}
                  <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0 mb-4 md:mb-0">
                    <Dumbbell className="w-6 h-6 text-orange-400 group-hover:scale-110 transition-transform" />
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="text-zinc-100 font-bold text-lg group-hover:text-orange-400 transition-colors">{treino.tipo_treino}</h4>
                    <p className="text-zinc-500 text-sm mt-1 max-w-2xl line-clamp-2 leading-relaxed">{treino.descricao}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 mt-6 md:mt-0 max-md:w-full justify-between md:justify-end">
                   <div className="text-zinc-400 text-sm hidden md:block capitalize">{dateTitle}</div>
                   
                   <div className="flex items-center space-x-2">
                     <span className={`px-2.5 py-1 text-xs font-bold rounded-md border ${labelIntensidade}`}>
                       {treino.intensidade}
                     </span>
                     <span className="bg-zinc-950 border border-zinc-800 text-zinc-300 font-bold px-3 py-1 text-sm rounded-lg flex items-center">
                       <Clock className="w-3.5 h-3.5 mr-1" /> {treino.duracao_minutos}m
                     </span>
                   </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
