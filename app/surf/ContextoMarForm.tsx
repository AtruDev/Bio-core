'use client'

import { useState } from 'react'
import { updateContextoMar } from './actions'
import { toast } from 'sonner'
import { Save, Loader2 } from 'lucide-react'

export function ContextoMarForm({ initialContexto }: { initialContexto?: string }) {
  const [isPending, setIsPending] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setIsPending(true)
    try {
      const res = await updateContextoMar(formData)
      if (res.success) {
        toast.success(res.message)
      } else {
        toast.error(res.message)
      }
    } catch (err) {
      toast.error('Ocorreu um erro ao salvar o contexto.')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6 mt-6 max-w-xl">
        <div className="space-y-4">
          <label className="text-sm font-medium text-zinc-300">Como está o oceano da sua praia principal?</label>
          <textarea
            name="contexto_mar"
            required
            rows={5}
            defaultValue={initialContexto || ''}
            placeholder="Ex: Praia de Piatã clássica hoje, ondas de 1.5 metro tubulares rápidas com vento terral fraco de manhã."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-4 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 resize-y"
          />
        </div>
        
        <button 
          type="submit"
          disabled={isPending}
          className="flex items-center justify-center space-x-2 w-full py-3.5 rounded-xl bg-cyan-600/20 text-cyan-400 font-bold hover:bg-cyan-600/30 transition-all border border-cyan-500/30 disabled:opacity-50 mt-8"
        >
          {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          <span>{isPending ? 'Sincronizando Oceano...' : 'Salvar Clima Local no BioCore'}</span>
        </button>
    </form>
  )
}
