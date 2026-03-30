'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: 'Usuário não autenticado.' }
  }

  const peso = parseFloat(formData.get('peso') as string)
  const altura = parseFloat(formData.get('altura') as string)
  const objetivo = formData.get('objetivo') as string
  const nivel_surf = formData.get('nivel_surf') as string

  const { error } = await supabase.from('perfil_usuario').upsert(
    {
      id: user.id,
      nome: user.email?.split('@')[0] || 'Atleta',
      email: user.email,
      peso,
      altura,
      objetivo,
      nivel_surf
    }, 
    { onConflict: 'id' }
  )

  if (error) {
    return { success: false, message: 'Falha ao salvar no banco de dados...' }
  }

  revalidatePath('/perfil')
  revalidatePath('/')
  return { success: true, message: 'Biometria atualizada com sucesso!' }
}
