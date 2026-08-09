import { Questao } from './types'

// Questões de exemplo para testar a plataforma antes de popular o banco
export const questoesExemplo: Questao[] = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    ano: 2023,
    edicao: 'XXXVII',
    materia: 'Direito Civil',
    enunciado: 'Assinale a opção correta acerca da personalidade civil da pessoa natural, conforme o Código Civil brasileiro.',
    alternativa_a: 'A personalidade civil da pessoa natural começa do nascimento com vida, mas a lei não coloca a salvo os direitos do nascituro desde a concepção.',
    alternativa_b: 'A capacidade de fato é adquirida automaticamente aos 16 anos de idade.',
    alternativa_c: 'A personalidade civil da pessoa natural começa do nascimento com vida, mas a lei põe a salvo, desde a concepção, os direitos do nascituro.',
    alternativa_d: 'O absolutamente incapaz pode praticar atos da vida civil sem necessidade de representação.',
    resposta_correta: 'C',
    explicacao: 'Art. 2º do CC/2002: "A personalidade civil da pessoa começa do nascimento com vida; mas a lei põe a salvo, desde a concepção, os direitos do nascituro."'
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    ano: 2023,
    edicao: 'XXXVII',
    materia: 'Direito Constitucional',
    enunciado: 'Sobre os direitos e garantias fundamentais previstos na Constituição Federal de 1988, assinale a opção correta.',
    alternativa_a: 'A casa é asilo inviolável do indivíduo, podendo nela penetrar-se a qualquer hora do dia com mandado judicial.',
    alternativa_b: 'Ninguém será preso senão em flagrante delito ou por ordem escrita e fundamentada de autoridade judiciária competente.',
    alternativa_c: 'É livre a manifestação do pensamento, sendo sempre permitido o anonimato.',
    alternativa_d: 'A inviolabilidade de correspondência pode ser restringida por decisão administrativa.',
    resposta_correta: 'B',
    explicacao: 'Art. 5º, LXI, CF/88: "ninguém será preso senão em flagrante delito ou por ordem escrita e fundamentada de autoridade judiciária competente."'
  },
  {
    id: '00000000-0000-0000-0000-000000000003',
    ano: 2022,
    edicao: 'XXXVI',
    materia: 'Ética Profissional',
    enunciado: 'Nos termos do Estatuto da Advocacia (Lei nº 8.906/1994), é vedado ao advogado:',
    alternativa_a: 'Recusar-se a patrocinar causa contrária aos seus princípios morais.',
    alternativa_b: 'Aceitar a defesa de acusado na esfera criminal.',
    alternativa_c: 'Assinar documentos sem que tenha participado do ato.',
    alternativa_d: 'Exercer a advocacia fora do juízo de sua inscrição.',
    resposta_correta: 'C',
    explicacao: 'É vedado ao advogado assinar documentos nos quais não tenha participado efetivamente, pois isso configura falsidade ideológica e viola os princípios éticos da advocacia.'
  },
  {
    id: '00000000-0000-0000-0000-000000000004',
    ano: 2022,
    edicao: 'XXXVI',
    materia: 'Direito Penal',
    enunciado: 'Sobre o concurso de crimes no Código Penal brasileiro, assinale a opção correta.',
    alternativa_a: 'No concurso material, aplica-se a pena mais grave ou, se iguais, somente uma delas.',
    alternativa_b: 'No crime continuado, o agente pratica duas ou mais ações, mas só responde pela mais grave.',
    alternativa_c: 'No concurso material, as penas são somadas.',
    alternativa_d: 'No concurso formal perfeito, as penas são sempre somadas.',
    resposta_correta: 'C',
    explicacao: 'Art. 69 do CP: No concurso material (quando o agente, mediante mais de uma ação ou omissão, pratica dois ou mais crimes), as penas privativas de liberdade são somadas.'
  },
  {
    id: '00000000-0000-0000-0000-000000000005',
    ano: 2021,
    edicao: 'XXXV',
    materia: 'Direito do Trabalho',
    enunciado: 'Com relação ao contrato de trabalho, assinale a alternativa correta conforme a CLT.',
    alternativa_a: 'O contrato de trabalho por prazo determinado pode ser firmado por qualquer prazo, sem limitação legal.',
    alternativa_b: 'A forma escrita é sempre obrigatória para a validade do contrato de trabalho.',
    alternativa_c: 'O contrato de trabalho por prazo determinado não pode exceder 2 (dois) anos.',
    alternativa_d: 'O contrato de experiência pode ser prorrogado por prazo indeterminado automaticamente.',
    resposta_correta: 'C',
    explicacao: 'Art. 445 da CLT: O contrato de trabalho por prazo determinado não poderá ser estipulado por mais de 2 (dois) anos, observada a regra do art. 451.'
  },
]

export const MATERIAS = [
  'Todas as Matérias',
  'Direito Civil',
  'Direito Penal',
  'Direito do Trabalho',
  'Direito Constitucional',
  'Direito Administrativo',
  'Direito Tributário',
  'Direito Empresarial',
  'Ética Profissional',
  'Direito Processual Civil',
  'Direito Processual Penal',
] as const
