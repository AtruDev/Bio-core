import { login, signup } from './actions'
import { Dumbbell, Waves, AlertTriangle } from 'lucide-react'

export default function LoginPage({
  searchParams,
}: {
  searchParams: { message: string }
}) {
  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-700 h-screen mx-auto">
      
      <div className="flex flex-col items-center justify-center space-y-3 mb-8 text-center text-zinc-50">
        <div className="flex space-x-2 bg-zinc-900 border border-zinc-800 p-3 rounded-2xl mb-2">
           <Waves className="w-8 h-8 text-cyan-400" />
           <Dumbbell className="w-8 h-8 text-orange-400" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">BioCore <span className="text-neutral-500">OS</span></h1>
        <p className="text-sm text-zinc-400 font-medium">Acesse seu painel exclusivo</p>
      </div>

      <form className="animate-in flex-1 flex flex-col w-full justify-start gap-4 text-zinc-50">
        
        {searchParams?.message && (
          <div className="flex items-center space-x-2 text-rose-500 bg-rose-500/10 px-4 py-3 rounded-lg border border-rose-500/20 text-sm font-medium mb-4">
            <AlertTriangle className="w-4 h-4" />
            <span>{searchParams.message}</span>
          </div>
        )}

        <div className="space-y-1">
          <label className="text-sm text-zinc-400 ml-1" htmlFor="email">
            Email
          </label>
          <input
            className="rounded-lg px-4 py-3 bg-zinc-900 border border-zinc-800 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none w-full transition-colors"
            name="email"
            placeholder="surf@exemplo.com"
            required
            autoComplete="email"
          />
        </div>

        <div className="space-y-1">
           <label className="text-sm text-zinc-400 ml-1" htmlFor="password">
             Senha
           </label>
           <input
             className="rounded-lg px-4 py-3 bg-zinc-900 border border-zinc-800 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none w-full transition-colors"
             type="password"
             name="password"
             placeholder="••••••••"
             required
           />
        </div>

        <button 
          formAction={login}
          className="bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-bold rounded-lg px-4 py-3 mb-2 w-full transition-colors mt-4 shadow-lg shadow-emerald-900/10"
        >
          Entrar no Dashboard
        </button>

        <button 
          formAction={signup}
          className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 font-semibold rounded-lg px-4 py-3 w-full transition-colors"
        >
          Não tem conta? Crie uma!
        </button>
      </form>
    </div>
  )
}
