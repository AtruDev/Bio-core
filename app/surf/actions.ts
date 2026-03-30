'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateContextoMar(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: 'Autenticação necessária.' }
  }

  const contexto_mar = formData.get('contexto_mar') as string

  // Usamos upsert passando name/email basicos pro caso de ser o primeiro upsert dele hoje (embora improvável)
  const { error } = await supabase.from('perfil_usuario').upsert(
    {
      id: user.id,
      contexto_mar: contexto_mar,
      // Passar obrigatorios de tabela pra não dar erro de null caso upsert crie (embora ele já exista)
      email: user.email,
    }, 
    { onConflict: 'id' }
  )

  if (error) {
    return { success: false, message: 'Falha ao plugar no banco de dados: ' + error.message }
  }

  revalidatePath('/surf')
  revalidatePath('/')
  return { success: true, message: 'Contexto do Oceano atualizado! A IA agora lerá esse mar.' }
}
