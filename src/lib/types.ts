export type Materia =
  | 'Direito Civil'
  | 'Direito Penal'
  | 'Direito do Trabalho'
  | 'Direito Constitucional'
  | 'Direito Administrativo'
  | 'Direito Tributário'
  | 'Direito Empresarial'
  | 'Ética Profissional'
  | 'Direito Processual Civil'
  | 'Direito Processual Penal'

export interface Questao {
  id: string
  ano: number
  edicao: string
  materia: Materia
  enunciado: string
  alternativa_a: string
  alternativa_b: string
  alternativa_c: string
  alternativa_d: string
  resposta_correta: 'A' | 'B' | 'C' | 'D'
  explicacao?: string
}

export interface Simulado {
  id: string
  user_id: string
  materia?: string
  total_questoes: number
  acertos: number
  erros: number
  percentual: number
  tempo_segundos?: number
  finalizado_em: string
}

export interface Resposta {
  id: string
  simulado_id: string
  questao_id: string
  resposta_marcada: 'A' | 'B' | 'C' | 'D'
  acertou: boolean
  motivo_erro?: string
  questao?: Questao
}

// Estado durante um simulado em andamento
export interface SimuladoAtivo {
  questoes: Questao[]
  respostas: Record<string, 'A' | 'B' | 'C' | 'D'>
  questaoAtual: number
  materia?: string
  iniciadoEm: Date
}
