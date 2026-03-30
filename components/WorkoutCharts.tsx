'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

export function WorkoutCharts({ data }: { data: any[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-zinc-500 border border-zinc-800 border-dashed rounded-2xl">
        Nenhum dado de treino registrado.
      </div>
    )
  }

  // Preparar dados (agrupar ou formatar para o chart)
  // Como são os últimos logs (order desc), vamos reverter para ordem cronológica:
  const chartData = [...data].reverse().map((item: any, index: number) => {
    // Formatar data:
    let dateStr = "Dia " + (index + 1);
    try {
      if (item.data_treino) {
        const d = new Date(item.data_treino + "T12:00:00Z");
        dateStr = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short' }).format(d);
      } else if (item.criado_em) {
        const d = new Date(item.criado_em);
        dateStr = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short' }).format(d);
      }
    } catch(e) {}

    return {
      name: dateStr,
      minutos: item.duracao_minutos || 0,
      intensidade: item.intensidade || 'Moderado'
    }
  });

  return (
    <div className="h-72 w-full mt-6">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 10,
            right: 10,
            left: -20,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
          <XAxis 
            dataKey="name" 
            stroke="#71717a" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            dy={10} 
          />
          <YAxis 
            stroke="#71717a" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            dx={-10}
          />
          <Tooltip 
            cursor={{ fill: '#27272a', opacity: 0.4 }}
            contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px', color: '#f4f4f5' }}
            itemStyle={{ color: '#fb923c', fontWeight: 'bold' }}
            formatter={(value) => [`${value} min`, 'Duração']}
            labelStyle={{ color: '#a1a1aa', marginBottom: '4px' }}
          />
          <Bar dataKey="minutos" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => {
               // Cores dinâmicas pela intensidade
               let color = "#fb923c"; // Laranja base
               if (entry.intensidade.toLowerCase().includes("alta")) color = "#ef4444"; // Vermelho
               else if (entry.intensidade.toLowerCase().includes("leve") || entry.intensidade.toLowerCase().includes("flex")) color = "#34d399"; // Verde
               
               return <Cell key={`cell-${index}`} fill={color} />
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
