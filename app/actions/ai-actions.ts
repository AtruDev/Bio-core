'use server'

import { GoogleGenerativeAI } from '@google/generative-ai'
import { createClient } from '@/utils/supabase/server'
import { calcularMifflinStJeor, Biometria } from '@/utils/nutrition'

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
export async function generateDailyDiet(): Promise<GenerationResult> {
  try {
    const apiKey = getApiKey()

    if (!apiKey) {
      return { success: false, message: 'Chave do Gemini não configurada (GEMINI_API_KEY).' }
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Crie uma conta para calcular dietas.')

    // Busca a biometria
    const { data: perfil } = await supabase.from('perfil_usuario').select('*').eq('id', user.id).single()

    if (!perfil?.peso || !perfil?.idade || !perfil?.genero) {
      return { success: false, message: 'Perfil incompleto. Atualize sua Biometria preenchendo Peso, Idade e Gênero.' }
    }

    const biometria: Biometria = {
      peso: perfil.peso,
      altura: perfil.altura || 1.70,
      idade: perfil.idade,
      genero: perfil.genero,
      nivel_surf: perfil.nivel_surf || 'Iniciante',
      objetivo: perfil.objetivo || 'Manutenção'
    }

    const macros = calcularMifflinStJeor(biometria)

    const hoje = new Date()
    const dias = Array.from({length: 7}).map((_, i) => {
      const d = new Date(hoje)
      d.setDate(d.getDate() + i)
      return d.toISOString().split('T')[0]
    })

    const prompt = `
      Você é um nutricionista esportivo de elite analisando um atleta surfista (${biometria.nivel_surf}).
      Oceano de hoje reportado pelo atleta: "${perfil.contexto_mar || 'Sem dados do mar, faça uma dieta padrão de treinos na terra.'}"
      O cálculo metabólico basal matemático EXATO efetuado em sistema já revelou os dados vitais:
      - TMB (Taxa Metabólica Basal): ${macros.tmb} kcal
      - Gasto Total (TEE): ${macros.gasto_total} kcal
      - META CALÓRICA DIÁRIA PARA ALCANÇAR '${biometria.objetivo}': ${macros.meta_calorica} kcal
      - DIETA MACROS EXATA (fechar o dia com): ${macros.proteina_g}g Proteína, ${macros.gordura_g}g Gordura, ${macros.carboidrato_g}g Carboidrato.
      
      Gere a dieta para exatos 7 dias correspondentes a essas datas: ${dias.join(', ')}.
      Dica: a cada dia, as 3 refeições SOMADAS devem atingir a META CALÓRICA e MACROS Diários exatos. Use comida natural (ovos, arroz, frango, azeite).

      Responda ESTRITAMENTE em formato JSON com a seguinte estrutura de Array PLANA (sem formatação markdown):
      [
        {
          "data_dieta": "DATAAQUI",
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

    if (user) {
      await supabase.from('perfil_usuario').upsert({
        id: user.id,
        nome: perfil.nome || 'Atru',
        email: user.email
      }, { onConflict: 'id' })

      // Limpa dietas antigas dessa semana para evitar duplicação severa
      await supabase.from('dieta_atual').delete().eq('user_id', user.id).in('data_dieta', dias)

      // 2. Insere a dieta da semana inteira
      const inserts = dietPlan.map((item: any) => ({
        user_id: user.id,
        data_dieta: item.data_dieta,
        refeicao_nome: item.refeicao_nome,
        descricao: item.descricao,
        calorias: item.calorias,
        proteinas: item.proteinas,
        carboidratos: item.carboidratos,
        gorduras: item.gorduras,
      }))
      const { error } = await supabase.from('dieta_atual').insert(inserts)
      if (error) throw new Error('Falha ao salvar a cadeia semanal no banco: ' + error.message)
    }

    return { success: true, message: 'Dieta Semanal Científica Gerada!', data: dietPlan }

  } catch (error: any) {
    console.error('ERRO GEMINI:', error)
    return { success: false, message: 'Erro na IA: ' + error.message }
  }
}

/**
 * Gera um treino adaptativo usando Gemini API.
 */
export async function generateWorkout(): Promise<GenerationResult> {
  try {
    const apiKey = getApiKey()

    if (!apiKey) {
      return { success: false, message: 'Chave do Gemini não configurada.' }
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Autenticação necessária.')

    const { data: perfil } = await supabase.from('perfil_usuario').select('*').eq('id', user.id).single()
    const nivel = perfil?.nivel_surf || "Surfista Intermediário"
    const objetivo = perfil?.objetivo || "Manutenção de desempenho"

    const prompt = `
      Você é um personal trainer especialista em preparação física de atletas.
      Crie 1 treino focado e adaptado para hoje considerando que o aluno é um ${nivel} focado em "${objetivo}".
      Também leve em conta o que ele nos relatou do oceano hoje para prescrever a intensidade ideal/compensatória: "${perfil?.contexto_mar || "Treino padrão em academia/solo"}".
      
      Responda ESTRITAMENTE em formato JSON (sem markdown):
      {
        "tipo_treino": "Treino Funcional Flex",
        "descricao": "Resumo do que fazer...",
        "duracao_minutos": 45,
        "intensidade": "Moderado"
      }
    `

    const result = await model.generateContent(prompt)
    let textResult = result.response.text().trim()
    textResult = textResult.replace(/```json|```/g, '').trim()

    const workout = JSON.parse(textResult)

    if (user) {
      await supabase.from('perfil_usuario').upsert({
        id: user.id,
        nome: 'Atru',
        email: user.email
      }, { onConflict: 'id' })

      const { error } = await supabase.from('logs_treino').insert({
        user_id: user.id,
        data_treino: new Date().toISOString().split('T')[0],
        tipo_treino: workout.tipo_treino,
        descricao: workout.descricao,
        duracao_minutos: workout.duracao_minutos,
        intensidade: workout.intensidade
      })
      if (error) throw new Error('Falha ao salvar o treino: ' + error.message)
    }

    return { success: true, message: 'Treino gerado!', data: workout }

  } catch (error: any) {
    return { success: false, message: 'Erro na IA: ' + error.message }
  }
}
