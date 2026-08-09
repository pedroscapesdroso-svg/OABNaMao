-- Execute no Supabase SQL Editor para adicionar a tabela de 2ª fase

CREATE TABLE pecas_simulados (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  area VARCHAR(100) NOT NULL,
  tipo_peca VARCHAR(100) NOT NULL,
  enunciado TEXT NOT NULL,
  resposta TEXT,
  tempo_segundos INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_pecas_user_id ON pecas_simulados(user_id);

ALTER TABLE pecas_simulados ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuário vê apenas suas peças" ON pecas_simulados
  FOR ALL USING (auth.uid() = user_id);
