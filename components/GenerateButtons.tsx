'use client'

import { useState } from 'react'
import { generateDailyDiet, generateWorkout } from '@/app/actions/ai-actions'
import { Sparkles, Loader2 } from 'lucide-react'

export function GenerateDietButton() {
  const [isPending, setIsPending] = useState(false)
  const [success, setSuccess] = useState('')

  const handleGenerate = async () => {
    try {
      console.log('Botão clicado! Iniciando Server Action de Dieta...')
      setIsPending(true)
      
      const res = await generateDailyDiet('Tenho 80kg, meu objetivo é performance no surf e hoje tem swell de 1.5m em Piatã.')
      
      console.log('Resposta do servidor:', res)
      if (res.success) {
        setSuccess('Nova dieta gerada!')
        setTimeout(() => window.location.reload(), 2000)
      } else {
        alert('Erro: ' + res.message)
      }
    } catch (err: any) {
      console.error('Falha crítica na requisição:', err)
      alert('Falha na comunicação com o servidor: ' + err.message)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="mt-6">
      <button 
        onClick={handleGenerate}
        disabled={isPending}
        className="flex items-center justify-center space-x-2 w-full py-2.5 rounded-lg bg-emerald-600/20 text-emerald-400 font-semibold hover:bg-emerald-600/30 transition-all border border-emerald-500/30 disabled:opacity-50 relative z-50 cursor-pointer"
      >
        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
        <span>{isPending ? 'Analisando e Gerando...' : 'Gerar Dieta IA (Swell)'}</span>
      </button>
      {success && <p className="text-xs text-emerald-400 mt-2 text-center animate-pulse">{success}</p>}
    </div>
  )
}

export function GenerateWorkoutButton() {
  const [isPending, setIsPending] = useState(false)
  const [success, setSuccess] = useState('')

  const handleGenerate = async () => {
    try {
      console.log('Botão clicado! Iniciando Server Action de Treino...')
      setIsPending(true)
      
      const res = await generateWorkout('Swell alto, preciso de um treino rápido de mobilidade e core para preparar para o surf.')
      
      if (res.success) {
        setSuccess('Novo treino gerado!')
        setTimeout(() => window.location.reload(), 2000)
      } else {
        alert('Erro: ' + res.message)
      }
    } catch (err: any) {
      console.error('Falha crítica na requisição:', err)
      alert('Falha na comunicação com o servidor: ' + err.message)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="mt-6">
      <button 
        onClick={handleGenerate}
        disabled={isPending}
        className="flex items-center justify-center space-x-2 w-full py-2.5 rounded-lg bg-orange-500/20 text-orange-400 font-semibold hover:bg-orange-500/30 transition-all border border-orange-500/30 disabled:opacity-50 relative z-50 cursor-pointer"
      >
        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
        <span>{isPending ? 'Gerando Adaptação...' : 'Adaptar Treino IA'}</span>
      </button>
      {success && <p className="text-xs text-orange-400 mt-2 text-center animate-pulse">{success}</p>}
    </div>
  )
}
