'use client'

import { useState } from 'react'
import { updateProfile } from '@/app/perfil/actions'
import { toast } from 'sonner'
import { Save, Loader2 } from 'lucide-react'

export function ProfileForm({ initialData }: { initialData?: any }) {
  const [isPending, setIsPending] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setIsPending(true)
    try {
      const res = await updateProfile(formData)
      if (res.success) {
        toast.success(res.message)
      } else {
        toast.error(res.message)
      }
    } catch (err) {
      toast.error('Ocorreu um erro ao salvar o perfil.')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6 mt-6 max-w-xl">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300">Peso Corporal (kg)</label>
          <input
            name="peso"
            type="number"
            step="0.1"
            required
            defaultValue={initialData?.peso || ''}
            placeholder="Ex: 82.5"
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300">Altura (m)</label>
          <input
            name="altura"
            type="number"
            step="0.01"
            required
            defaultValue={initialData?.altura || ''}
            placeholder="Ex: 1.83"
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-300">Nível no Surf</label>
        <select 
          name="nivel_surf"
          defaultValue={initialData?.nivel_surf || 'Iniciante (Começando a dropar)'}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 appearance-none text-zinc-50"
        >
          <option value="Iniciante">Iniciante (Começando a dropar)</option>
          <option value="Intermediário">Intermediário (Paredes, manobras básicas)</option>
          <option value="Avançado">Avançado (Manobras aéreas, tubos)</option>
          <option value="Profissional">Pró (Competidor de alta performance)</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-300">Objetivo Físico do Mês</label>
        <select 
          name="objetivo"
          defaultValue={initialData?.objetivo || 'Perda de Gordura para ficar mais leve na prancha'}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 appearance-none text-zinc-50"
        >
          <option value="Performance e Agilidade na água">Performance Absoluta na Água</option>
          <option value="Manutenção do Gás">Apenas Manter o Gás no Surf</option>
          <option value="Perda de Gordura para ficar mais leve na prancha">Limpar Gordura (Secar)</option>
          <option value="Ganho de Massa Muscular sem perder remada">Ganho de Massa Rígida</option>
        </select>
      </div>

      <button 
        type="submit"
        disabled={isPending}
        className="flex items-center justify-center space-x-2 w-full py-3.5 rounded-xl bg-cyan-600/20 text-cyan-400 font-bold hover:bg-cyan-600/30 transition-all border border-cyan-500/30 disabled:opacity-50 mt-8"
      >
        {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
        <span>{isPending ? 'Salvando matriz...' : 'Atualizar BioCore'}</span>
      </button>

    </form>
  )
}
