-- Criação da tabela perfil_usuario
CREATE TABLE public.perfil_usuario (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    peso DECIMAL(5, 2),
    altura DECIMAL(5, 2),
    objetivo TEXT,
    nivel_surf TEXT,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ativar RLS (Row Level Security)
ALTER TABLE public.perfil_usuario ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
CREATE POLICY "Usuários podem ver seu próprio perfil." ON public.perfil_usuario
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seu próprio perfil." ON public.perfil_usuario
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Usuários podem inserir seu próprio perfil." ON public.perfil_usuario
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Função para atualizar timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.atualizado_em = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_perfil_user_updated
    BEFORE UPDATE ON public.perfil_usuario
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Criação da tabela dieta_atual
CREATE TABLE public.dieta_atual (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.perfil_usuario(id) ON DELETE CASCADE NOT NULL,
    data_dieta DATE DEFAULT CURRENT_DATE NOT NULL,
    refeicao_nome TEXT NOT NULL, -- Ex: 'Café da Manhã', 'Marmita 1'
    descricao TEXT NOT NULL,
    calorias INTEGER,
    proteinas DECIMAL(5, 2),
    carboidratos DECIMAL(5, 2),
    gorduras DECIMAL(5, 2),
    consumido BOOLEAN DEFAULT FALSE NOT NULL,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.dieta_atual ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem gerenciar sua própria dieta." ON public.dieta_atual
    FOR ALL USING (auth.uid() = user_id);

-- Criação da tabela logs_treino
CREATE TABLE public.logs_treino (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.perfil_usuario(id) ON DELETE CASCADE NOT NULL,
    data_treino DATE DEFAULT CURRENT_DATE NOT NULL,
    tipo_treino TEXT NOT NULL, -- Ex: 'Treino A', 'Treino B', 'Surf'
    descricao TEXT,
    duracao_minutos INTEGER,
    intensidade TEXT, -- Ex: 'Leve', 'Moderado', 'Intenso'
    concluido BOOLEAN DEFAULT FALSE NOT NULL,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.logs_treino ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem gerenciar seus próprios logs de treino." ON public.logs_treino
    FOR ALL USING (auth.uid() = user_id);
