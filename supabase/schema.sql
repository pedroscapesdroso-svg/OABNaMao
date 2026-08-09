-- =============================================
-- SCHEMA OAB NA MÃO - Execute no Supabase SQL Editor
-- =============================================

-- Tabela de questões (base de dados das provas)
CREATE TABLE questoes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ano INTEGER NOT NULL,                          -- Ex: 2023
  edicao VARCHAR(10) NOT NULL,                   -- Ex: "XXXVII"
  materia VARCHAR(100) NOT NULL,                 -- Ex: "Direito Civil"
  enunciado TEXT NOT NULL,
  alternativa_a TEXT NOT NULL,
  alternativa_b TEXT NOT NULL,
  alternativa_c TEXT NOT NULL,
  alternativa_d TEXT NOT NULL,
  resposta_correta CHAR(1) NOT NULL CHECK (resposta_correta IN ('A','B','C','D')),
  explicacao TEXT,                               -- Comentário da resposta correta
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de simulados feitos por cada usuário
CREATE TABLE simulados (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  materia VARCHAR(100),                          -- NULL = simulado geral
  total_questoes INTEGER NOT NULL,
  acertos INTEGER NOT NULL DEFAULT 0,
  erros INTEGER NOT NULL DEFAULT 0,
  percentual DECIMAL(5,2),                       -- % de acerto
  tempo_segundos INTEGER,                        -- Tempo gasto no simulado
  finalizado_em TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de respostas individuais de cada simulado
CREATE TABLE respostas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  simulado_id UUID REFERENCES simulados(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  questao_id UUID REFERENCES questoes(id) NOT NULL,
  resposta_marcada CHAR(1) CHECK (resposta_marcada IN ('A','B','C','D')),
  acertou BOOLEAN NOT NULL,
  motivo_erro TEXT,                              -- Usuário pode anotar por que errou
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_simulados_user_id ON simulados(user_id);
CREATE INDEX idx_respostas_simulado_id ON respostas(simulado_id);
CREATE INDEX idx_respostas_user_id ON respostas(user_id);
CREATE INDEX idx_questoes_materia ON questoes(materia);
CREATE INDEX idx_questoes_ano ON questoes(ano);

-- =============================================
-- RLS (Row Level Security) - cada usuário vê só os seus dados
-- =============================================
ALTER TABLE simulados ENABLE ROW LEVEL SECURITY;
ALTER TABLE respostas ENABLE ROW LEVEL SECURITY;

-- Políticas para simulados
CREATE POLICY "Usuário vê apenas seus simulados" ON simulados
  FOR ALL USING (auth.uid() = user_id);

-- Políticas para respostas
CREATE POLICY "Usuário vê apenas suas respostas" ON respostas
  FOR ALL USING (auth.uid() = user_id);

-- Questões são públicas (leitura)
ALTER TABLE questoes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Questões são públicas para leitura" ON questoes
  FOR SELECT USING (true);
