'use server'

import { GoogleGenerativeAI } from '@google/generative-ai'
import { createClient } from '@/utils/supabase/server'

interface GenerationResult {
  success: boolean
  message: string
  data?: any
}

function getApiKey() {
  const envKeys = Object.keys(process.env).filter(k => k.toUpperCase().includes('GEMINI'))
  console.log('--- DEBUG DE CHAVES ENCONTRADAS ---')
  console.log('Nomes encontrados:', envKeys)
  
  const rawKey = process.env.GEMINI_API_KEY || process.env[envKeys[0]] || ''
  return rawKey.trim()
}

/**
 * Gera um plano de dieta adaptativo usando Gemini API
 */
export async function generateDailyDiet(context: string): Promise<GenerationResult> {
  try {
    const apiKey = getApiKey()

    if (!apiKey) {
      return { success: false, message: 'Chave do Gemini não configurada (GEMINI_API_KEY).' }
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' })

    const prompt = `
      Você é um nutricionista especialista em surfistas.
      Gere 3 refeições balanceadas para o dia considerando o seguinte contexto do usuário: "${context}".
      Responda ESTRITAMENTE em formato JSON com a seguinte estrutura de Array (sem formatação markdown):
      [
        {
          "refeicao_nome": "Café da Manhã",
          "descricao": "O que comer...",
          "calorias": 400,
          "proteinas": 20,
          "carboidratos": 50,
          "gorduras": 10
        }
      ]
    `

    const result = await model.generateContent(prompt)
    let textResult = result.response.text().trim()
    textResult = textResult.replace(/```json|```/g, '').trim()

    const dietPlan = JSON.parse(textResult)

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      const inserts = dietPlan.map((item: any) => ({
        user_id: user.id,
        refeicao_nome: item.refeicao_nome,
        descricao: item.descricao,
        calorias: item.calorias,
        proteinas: item.proteinas,
        carboidratos: item.carboidratos,
        gorduras: item.gorduras,
      }))
      await supabase.from('dieta_atual').insert(inserts)
    }

    return { success: true, message: 'Dieta gerada!', data: dietPlan }

  } catch (error: any) {
    console.error('ERRO GEMINI:', error)
    return { success: false, message: 'Erro na IA: ' + error.message }
  }
}

/**
 * Gera um treino adaptativo usando Gemini API.
 */
export async function generateWorkout(context: string): Promise<GenerationResult> {
  try {
    const apiKey = getApiKey()

    if (!apiKey) {
      return { success: false, message: 'Chave do Gemini não configurada.' }
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const prompt = `
      Você é um personal trainer especialista em surf.
      Crie 1 treino focado para o dia considerando: "${context}".
      Responda ESTRITAMENTE em formato JSON (sem markdown):
      {
        "tipo_treino": "Treino Funcional",
        "descricao": "Resumo do que fazer...",
        "duracao_minutos": 45,
        "intensidade": "Moderado"
      }
    `

    const result = await model.generateContent(prompt)
    let textResult = result.response.text().trim()
    textResult = textResult.replace(/```json|```/g, '').trim()

    const workout = JSON.parse(textResult)

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      await supabase.from('logs_treino').insert({
        user_id: user.id,
        tipo_treino: workout.tipo_treino,
        descricao: workout.descricao,
        duracao_minutos: workout.duracao_minutos,
        intensidade: workout.intensidade
      })
    }

    return { success: true, message: 'Treino gerado!', data: workout }

  } catch (error: any) {
    return { success: false, message: 'Erro na IA: ' + error.message }
  }
}
