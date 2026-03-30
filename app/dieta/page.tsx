import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { calcularMifflinStJeor, Biometria } from "@/utils/nutrition"
import { Flame, Beef, Wheat, Activity, Info, Calendar } from "lucide-react"
import { GenerateDietButton } from "@/components/GenerateButtons"
import { MealPlannerView } from "@/components/MealPlannerView"

export default async function DietaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: perfil } = await supabase.from('perfil_usuario').select('*').eq('id', user.id).single()

  let macros = null;
  let hasValidBio = false;

  if (perfil?.peso && perfil?.idade && perfil?.genero) {
    hasValidBio = true;
    const biometria: Biometria = {
      peso: perfil.peso,
      altura: perfil.altura || 1.80,
      idade: perfil.idade,
      genero: perfil.genero,
      nivel_surf: perfil.nivel_surf || 'Iniciante',
      objetivo: perfil.objetivo || 'Manutenção'
    }
    macros = calcularMifflinStJeor(biometria);
  }

  // Fetch meals and order by date
  const { data: meals } = await supabase
    .from('dieta_atual')
    .select('*')
    .eq('user_id', user.id)
    .order('data_dieta', { ascending: true })

  // Group meals by data_dieta
  const groupedMeals = meals?.reduce((acc: any, meal: any) => {
    if (!meal.data_dieta) return acc;
    if(!acc[meal.data_dieta]) acc[meal.data_dieta] = [];
    acc[meal.data_dieta].push(meal);
    return acc;
  }, {}) || {};

  const dates = Object.keys(groupedMeals).sort();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-50">Nutrição Científica</h1>
          <p className="text-zinc-400 mt-1">Sua máquina programada para {perfil?.objetivo || 'alta performance'}.</p>
        </div>
        <div className="w-full md:w-auto p-3">
          <GenerateDietButton />
        </div>
      </div>

      {!hasValidBio ? (
         <div className="bg-amber-500/10 border border-amber-500/20 p-6 rounded-2xl flex items-start space-x-4">
            <Info className="w-6 h-6 text-amber-500 mt-1" />
            <div>
              <h3 className="text-amber-500 font-semibold mb-1">Cálculo Bloqueado: Biometria Incompleta</h3>
              <p className="text-amber-500/80 text-sm">Vá até o seu Perfil e adicione sua Idade e Gênero para habilitar o Motor Metabólico Exato antes de gerar o cardápio.</p>
            </div>
         </div>
      ) : macros && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-8">
          {/* Card Metabólico TMB */}
          <div className="bg-zinc-900 border border-zinc-800 p-5 flex flex-col justify-center rounded-2xl relative overflow-hidden group hover:border-cyan-500/50 transition-colors">
            <div className="absolute -right-4 -top-4 opacity-5">
              <Activity className="w-24 h-24" />
            </div>
            <div className="text-cyan-400 mb-2 font-medium flex items-center space-x-2">
              <Activity className="w-4 h-4" /> <span>Taxa Metabólica Basal</span>
            </div>
            <div className="text-2xl font-bold text-zinc-50">{macros.tmb} <span className="text-sm font-normal text-zinc-400">kcal/dia</span></div>
            <p className="text-xs text-zinc-500 mt-1">O que você gasta descansando (Mifflin-St Jeor)</p>
          </div>

          {/* Card Meta Calórica */}
          <div className="bg-zinc-900 border border-zinc-800 p-5 flex flex-col justify-center rounded-2xl relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
            <div className="absolute -right-4 -top-4 opacity-5">
              <Flame className="w-24 h-24" />
            </div>
            <div className="text-emerald-400 mb-2 font-medium flex items-center space-x-2">
              <Flame className="w-4 h-4" /> <span>Alvo Calórico Diário</span>
            </div>
            <div className="text-2xl font-bold text-zinc-50">{macros.meta_calorica} <span className="text-sm font-normal text-zinc-400">kcal/dia</span></div>
            <p className="text-xs text-zinc-500 mt-1">Meta final calculada para o seu objetivo</p>
          </div>

           {/* Card Proteína/Gordura */}
          <div className="bg-zinc-900 border border-zinc-800 p-5 flex flex-col justify-center rounded-2xl relative overflow-hidden col-span-2 lg:col-span-2 group hover:border-purple-500/50 transition-colors">
            <div className="text-purple-400 mb-4 font-medium flex items-center space-x-2">
              <Beef className="w-4 h-4" /> <span>Divisão de Micronutrientes Alvo</span>
            </div>
            <div className="flex items-center space-x-8">
               <div>
                  <div className="text-xs text-zinc-400 mb-1">Proteína (2.2g/kg)</div>
                  <div className="text-xl font-bold text-zinc-50">{macros.proteina_g}g</div>
               </div>
               <div className="h-8 w-px bg-zinc-800"></div>
               <div>
                  <div className="text-xs text-zinc-400 mb-1">Carboidrato</div>
                  <div className="text-xl font-bold text-zinc-50">{macros.carboidrato_g}g</div>
               </div>
               <div className="h-8 w-px bg-zinc-800"></div>
               <div>
                  <div className="text-xs text-zinc-400 mb-1">Gordura (~1.0g)</div>
                  <div className="text-xl font-bold text-zinc-50">{macros.gordura_g}g</div>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Visão de Kanban / Grid */}
      <MealPlannerView groupedMeals={groupedMeals} dates={dates} />
    </div>
  )
}
