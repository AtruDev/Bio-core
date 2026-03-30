<div align="center">
  <div style="background: linear-gradient(90deg, #10b981, #06b6d4); -webkit-background-clip: text; color: transparent;">
    <h1>🌊 BioCore OS</h1>
  </div>
  <p><strong>Dashboard Inteligente de Nutrição e Alta Performance para Surfistas.</strong></p>
  
  ![Next.js](https://img.shields.io/badge/Next.js-15+-black?style=for-the-badge&logo=next.js)
  ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
  ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
  ![Gemini AI](https://img.shields.io/badge/Google_Gemini_AI-8E75B2?style=for-the-badge&logo=google&logoColor=white)
  ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
</div>

<br />

## 📖 Sobre o Projeto

O **BioCore OS** é um sistema SaaS de prateleira superior desenvolvido para focar na otimização da performance de surfistas e atletas. Fugindo de aplicativos genéricos, este projeto consolida Biometria real, **Modelos Matemáticos de Taxa Metabólica Basal (Mifflin-St Jeor)** e Inteligência Artificial Avançada do Google Gemini para planejar semanas inteiras de dietas e treinos perfeitamente alinhados com o estado do oceano e o objetivo corporal do usuário.

A interface foi inteiramente criada focando numa experiência altamente interativa de Painel Retrátil (Sidebar responsivo), paletas escuras premium (Dark Theme), modais com componentes modernos usando estado no cliente de React + Shadcn, e gráficos em tempo real de `Recharts`.

## 🚀 Principais Features

- 🧠 **Cérebro AI Semanal**: Em vez de gerar dicas básicas, a aplicação cruza os macros exatos da biometria do atleta e instrui o Gemini a responder e gerar, em milissegundos, um Kanban semanal (7 dias de cardápio exato em JSON rígido e distribuído no DB).
- 🏄‍♂️ **Contexto de Oceano ao Vivo**: Uma página separada apenas para coletar como está o "mar da sua praia local", forçando a AI a gerar treinos funcionais (flexões/aquecimentos/compensação de remada) que se **adaptam** aos desafios mecânicos e à previsão ambiental exata informada.
- 📊 **Dashboard Analítico (Recharts)**: Renderização gráfica das horas reais de treino cumpridas em contraste aos níveis de intensidade calculados.
- 📐 **Motor Científico Integrado**: Calculadora pura de macros e TEE feita para travar as alucinações de modelos de dados de LLMs. Se a dieta recomendada não cravar X proteínas, o sistema não aceita.
- 🛡️ **Setup com Supabase (Segurança)**: Autenticação mágica livre de senhas nativa do Supabase e persistência rápida, garantindo que o banco de dados sirva em Edge global.

---

## 🛠️ Tecnologias Utilizadas

- **Framework Core**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Linguagem Principal**: TypeScript
- **Estilização**: TailwindCSS + `lucide-react` + `tw-animate-css` + Componentes do Shadcn
- **Backend / BaaS**: [Supabase](https://supabase.com/) (Auth + PostgreSQL Data)
- **Engine Inteligente**: SDK Node.js `@google/generative-ai` (Gemini 2.5 Flash)
- **Data-Viz**: Recharts
- **Toast Notifications**: Sonner

---

## ⚙️ Pré-requisitos & Instalação Local

Certifique-se de que sua máquina possui o [Node.js](https://nodejs.org/) versão 18+ instalado.

### 1. Clonando o Repositório

```bash
git clone https://github.com/SEU-USUARIO/biocore-app.git
cd biocore-app
```

### 2. Instalando as Dependências

```bash
npm install
# ou yarn / pnpm install
```

### 3. Configuração de Variáveis de Ambiente (Supabase + Google)

Crie um arquivo `.env.local` na raiz principal do projeto e defina os seguintes dados obrigatoriamente (obtenha as chaves nas respectivas plataformas):

```env
# Conexão principal do banco e auth
NEXT_PUBLIC_SUPABASE_URL=sua_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_aqui

# Integração do Motor de IA 
GEMINI_API_KEY=sua_developer_key_google_ai_aqui
```

### 4. Setup Rápido do Banco (Supabase SQL)

Você precisará criar ou ajustar as seguintes tabelas em seu `public` schema pelo painel do Supabase com as regras RLS desativadas (ou configuradas atrelando aos IDs):

- `perfil_usuario`: `id` (uuid, referência a auth.users), `nome`, `email`, `peso`, `altura`, `idade`, `genero`, `nivel_surf`, `objetivo`, `contexto_mar`.
- `dieta_atual`: `id`, `user_id` (uuid), `data_dieta` (date), `refeicao_nome`, `descricao`, `calorias`, `proteinas`, `carboidratos`, `gorduras`.
- `logs_treino`: `id`, `user_id` (uuid), `data_treino` (date), `tipo_treino`, `descricao`, `intensidade`, `duracao_minutos`, `criado_em` (timestamp).

### 5. Start na Aplicação

```bash
npm run dev
```

Abra `http://localhost:3000` em seu navegador para ver o painel com as mudanças ao vivo.

---

## 👨‍💻 Futuro do Biocore MVP

O código atual reflete o fechamento do MVP sólido e principal. Considerações futuras preveem expandir a IA para ter mais persistência de diálogo como um chat real ao lado das abas estáticas, permitindo com que o usuário troque refeições individuais dentro do quadro semanal Kanban.
