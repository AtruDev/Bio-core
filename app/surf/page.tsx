import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { Waves, Wind, Navigation, Save, AlertTriangle } from "lucide-react"
import { ContextoMarForm } from "./ContextoMarForm"

export default async function SurfPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Busca perfil pra preencher defaultValue do Contexto de Mar
  const { data: perfil } = await supabase.from('perfil_usuario').select('*').eq('id', user.id).single()

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-50">Condições do Oceano</h1>
        <p className="text-zinc-400 mt-1">Avise o Cérebro do BioCore como o mar amanheceu hoje para adaptar seus treinos.</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-6 border-b border-zinc-800 pb-4">
             <Waves className="w-6 h-6 text-cyan-500" />
             <h2 className="text-xl font-bold text-zinc-100">Reporte ao Algoritmo</h2>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex items-start space-x-3 mb-8">
             <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
             <p className="text-sm text-amber-500/90 leading-relaxed">
               As dietas e treinos deixaram de ser gerados com dados de laboratório irreais ("Swell clássico"). Agora, a Inteligência Artificial vai **LER EXATAMENTE** o que você digitar no campo abaixo toda vez que for criar 7 dias de marmitas. 
             </p>
          </div>

          <ContextoMarForm initialContexto={perfil?.contexto_mar} />

        </div>
      </div>
    </div>
  )
}
