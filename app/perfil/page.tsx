import { createClient } from "@/utils/supabase/server"
import { ProfileForm } from "@/components/ProfileForm"
import { redirect } from "next/navigation"

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('perfil_usuario')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-50">Sua Biometria</h1>
        <p className="text-zinc-400 mt-1">Configure o seu perfil base para as decisões da IA do BioCore.</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="relative z-10">
          <ProfileForm initialData={profile} />
        </div>
      </div>
    </div>
  )
}
