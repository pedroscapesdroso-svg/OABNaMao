// Peças mais cobradas na 2ª fase OAB por área - baseado em dados reais da FGV

export interface CasoPratico {
  id: string
  area: string
  peca: string           // Tipo de peça exigida
  frequencia: number     // Quantas vezes foi cobrada historicamente
  enunciado: string
  partes: {
    polo_ativo: string
    polo_passivo: string
  }
  fatos: string
  pedidos_sugeridos: string[]  // Dica de pedidos para o aluno
  estrutura: EstruturaPeca     // Esqueleto da peça
}

export interface EstruturaPeca {
  cabecalho: string
  qualificacao: string
  dos_fatos: string
  do_direito: string
  dos_pedidos: string
  fechamento: string
}

// ─── DIREITO CIVIL ────────────────────────────────────────────────────────────
// Petição Inicial é campeã: 24x cobrada. Apelação: 7x.
export const casosCivil: CasoPratico[] = [
  {
    id: 'civil-001',
    area: 'Direito Civil',
    peca: 'Petição Inicial',
    frequencia: 24,
    enunciado: `João da Silva celebrou contrato de compra e venda de um imóvel com Maria Souza pelo valor de R$ 350.000,00. João pagou R$ 200.000,00 à vista e se comprometeu a pagar o restante em 30 dias. Decorrido o prazo, João não efetuou o pagamento. Maria Souza deseja rescindir o contrato e reaver o imóvel, além de ser indenizada pelos danos sofridos com a inadimplência. Redija a peça adequada como advogado(a) de Maria Souza.`,
    partes: { polo_ativo: 'Maria Souza', polo_passivo: 'João da Silva' },
    fatos: 'Contrato de compra e venda. Inadimplemento do saldo devedor de R$ 150.000,00. Mora configurada.',
    pedidos_sugeridos: [
      'Rescisão do contrato de compra e venda',
      'Reintegração de posse do imóvel',
      'Condenação ao pagamento de perdas e danos',
      'Condenação ao pagamento de aluguéis pelo período de ocupação indevida',
    ],
    estrutura: {
      cabecalho: 'EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) DE DIREITO DA ___ VARA CÍVEL DA COMARCA DE ___',
      qualificacao: '[NOME DO(A) AUTOR(A)], [nacionalidade], [estado civil], [profissão], portador(a) do RG nº ___ e CPF nº ___, residente e domiciliado(a) em [endereço], vem, por seu(sua) advogado(a) infra-assinado(a), propor a presente',
      dos_fatos: 'Narrar cronologicamente: celebração do contrato, valor pago, prazo acordado, inadimplemento e tentativas de solução amigável.',
      do_direito: 'Art. 475 do CC (rescisão por inadimplemento). Art. 389 do CC (perdas e danos). Art. 927 do CC (responsabilidade civil).',
      dos_pedidos: 'a) a procedência da ação; b) a rescisão do contrato; c) a reintegração de posse; d) a condenação em perdas e danos; e) a condenação em honorários e custas.',
      fechamento: 'Dá-se à causa o valor de R$ ___. Termos em que pede deferimento. [Local], [data]. [Nome do Advogado], OAB/__ nº ___.',
    },
  },
  {
    id: 'civil-002',
    area: 'Direito Civil',
    peca: 'Apelação',
    frequencia: 7,
    enunciado: `Pedro Alves ajuizou ação de cobrança contra Empresa XYZ Ltda., referente a prestação de serviços de consultoria no valor de R$ 80.000,00. O juízo de 1ª instância julgou improcedente o pedido, entendendo que não havia prova suficiente do serviço prestado. Pedro discorda, pois juntou contrato assinado, notas fiscais e e-mails confirmando a execução. Redija o recurso cabível como advogado(a) de Pedro.`,
    partes: { polo_ativo: 'Pedro Alves (apelante)', polo_passivo: 'Empresa XYZ Ltda. (apelada)' },
    fatos: 'Ação de cobrança julgada improcedente. Provas existentes: contrato, NFs e e-mails. Erro na valoração probatória.',
    pedidos_sugeridos: [
      'Reforma da sentença para julgar procedente o pedido',
      'Condenação da apelada ao pagamento de R$ 80.000,00',
      'Condenação em honorários recursais',
    ],
    estrutura: {
      cabecalho: 'EGRÉGIO TRIBUNAL DE JUSTIÇA DO ESTADO DE ___',
      qualificacao: '[NOME DO(A) APELANTE], já qualificado(a) nos autos do processo em epígrafe, vem, por seu(sua) advogado(a), interpor o presente RECURSO DE APELAÇÃO, com fundamento no art. 1.009 do CPC.',
      dos_fatos: 'Síntese do processo: ajuizamento, contestação, sentença recorrida e seus fundamentos.',
      do_direito: 'Art. 1.009 e ss. do CPC. Erro na apreciação das provas (art. 371 CPC). Art. 373, I do CPC (ônus da prova do autor).',
      dos_pedidos: 'Conhecimento e provimento do recurso para reformar a sentença e julgar procedente o pedido inicial.',
      fechamento: '[Local], [data]. [Nome do Advogado], OAB/__ nº ___.',
    },
  },
]

// ─── DIREITO PENAL ────────────────────────────────────────────────────────────
// Apelação: 11x. Memoriais: 7x. Recurso em Sentido Estrito: 5x.
export const casosPenal: CasoPratico[] = [
  {
    id: 'penal-001',
    area: 'Direito Penal',
    peca: 'Apelação',
    frequencia: 11,
    enunciado: `Carlos Mendes foi condenado pelo crime de furto qualificado (art. 155, §4º, IV do CP) à pena de 2 anos e 8 meses de reclusão, em regime fechado. A defesa sustenta que não houve concurso de agentes comprovado e que a pena-base foi fixada acima do mínimo sem fundamentação idônea. Redija o recurso cabível como advogado(a) de Carlos.`,
    partes: { polo_ativo: 'Carlos Mendes (apelante)', polo_passivo: 'Ministério Público (apelado)' },
    fatos: 'Condenação por furto qualificado. Ausência de prova do concurso de agentes. Pena-base exacerbada sem fundamentação.',
    pedidos_sugeridos: [
      'Absolvição por insuficiência de provas (art. 386, VII CPP)',
      'Subsidiariamente: desclassificação para furto simples',
      'Redução da pena-base ao mínimo legal',
      'Fixação de regime aberto',
    ],
    estrutura: {
      cabecalho: 'EGRÉGIO TRIBUNAL DE JUSTIÇA DO ESTADO DE ___',
      qualificacao: '[NOME DO(A) APELANTE], já qualificado(a) nos autos, vem interpor RECURSO DE APELAÇÃO com fundamento no art. 593, I do CPP.',
      dos_fatos: 'Breve relato: denúncia, instrução, sentença condenatória e seus fundamentos.',
      do_direito: 'Art. 593 CPP. Ausência de prova do concurso (art. 29 CP). Nulidade da dosimetria (art. 68 CP e Súmula 444 STJ).',
      dos_pedidos: 'Provimento do recurso para absolver o réu ou, subsidiariamente, desclassificar e reduzir a pena.',
      fechamento: '[Local], [data]. [Nome do Advogado], OAB/__ nº ___.',
    },
  },
  {
    id: 'penal-002',
    area: 'Direito Penal',
    peca: 'Resposta à Acusação',
    frequencia: 5,
    enunciado: `Ana Lima foi denunciada pelo crime de estelionato (art. 171 do CP) por ter, supostamente, vendido um veículo que não era seu. Ana alega que adquiriu o veículo de boa-fé e desconhecia qualquer irregularidade. O processo está na fase de resposta à acusação. Redija a peça adequada como advogado(a) de Ana.`,
    partes: { polo_ativo: 'Ministério Público', polo_passivo: 'Ana Lima (ré)' },
    fatos: 'Denúncia por estelionato. Ausência de dolo. Boa-fé na aquisição do veículo. Atipicidade da conduta.',
    pedidos_sugeridos: [
      'Absolvição sumária por atipicidade (art. 397, III CPP)',
      'Subsidiariamente: rejeição da denúncia por falta de justa causa',
    ],
    estrutura: {
      cabecalho: 'EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) DE DIREITO DA ___ VARA CRIMINAL DA COMARCA DE ___',
      qualificacao: '[NOME DA RÉ], já qualificada nos autos, vem apresentar RESPOSTA À ACUSAÇÃO, nos termos dos arts. 396 e 396-A do CPP.',
      dos_fatos: 'Descrição dos fatos pela perspectiva da defesa: aquisição de boa-fé, ausência de dolo, provas a serem produzidas.',
      do_direito: 'Art. 171 CP (elemento subjetivo dolo). Art. 397, III CPP (absolvição sumária). Princípio da presunção de inocência.',
      dos_pedidos: 'Absolvição sumária por atipicidade ou, subsidiariamente, produção de provas e absolvição ao final.',
      fechamento: '[Local], [data]. [Nome do Advogado], OAB/__ nº ___.',
    },
  },
]

// ─── DIREITO DO TRABALHO ──────────────────────────────────────────────────────
// Recurso Ordinário: 13x. Contestação: 13x. Reclamatória: 8x.
export const casosTrabalho: CasoPratico[] = [
  {
    id: 'trabalho-001',
    area: 'Direito do Trabalho',
    peca: 'Reclamatória Trabalhista',
    frequencia: 8,
    enunciado: `Roberto Silva trabalhou para a empresa Beta Ltda. por 5 anos como analista financeiro. Foi dispensado sem justa causa e a empresa se recusou a pagar as verbas rescisórias (FGTS, aviso prévio, 13º proporcional e férias proporcionais). Além disso, Roberto trabalhava 2 horas extras por dia sem receber. Redija a peça adequada como advogado(a) de Roberto.`,
    partes: { polo_ativo: 'Roberto Silva (reclamante)', polo_passivo: 'Beta Ltda. (reclamada)' },
    fatos: '5 anos de vínculo. Dispensa sem justa causa. Verbas rescisórias não pagas. Horas extras não remuneradas (2h/dia).',
    pedidos_sugeridos: [
      'Pagamento de aviso prévio proporcional (art. 487 CLT)',
      'Pagamento de 13º salário proporcional',
      'Pagamento de férias proporcionais + 1/3',
      'Liberação do FGTS + multa de 40%',
      'Pagamento de horas extras com adicional de 50%',
      'Pagamento de reflexos em DSR, férias e 13º',
    ],
    estrutura: {
      cabecalho: 'EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) DO TRABALHO DA ___ VARA DO TRABALHO DE ___',
      qualificacao: '[NOME DO RECLAMANTE], [qualificação], vem propor RECLAMATÓRIA TRABALHISTA em face de [RECLAMADA], pelos fatos e fundamentos a seguir.',
      dos_fatos: 'Admissão, função, salário, jornada, dispensa e recusa de pagamento das verbas.',
      do_direito: 'Arts. 457, 458, 487, 18 da Lei 8.036/90 (FGTS), art. 7º CF/88, Súmula 115 TST (horas extras).',
      dos_pedidos: 'Listagem de todas as verbas com valores calculados. Pedido de gratuidade de justiça.',
      fechamento: 'Dá-se à causa o valor de R$ ___. [Local], [data]. [Nome do Advogado], OAB/__ nº ___.',
    },
  },
  {
    id: 'trabalho-002',
    area: 'Direito do Trabalho',
    peca: 'Recurso Ordinário',
    frequencia: 13,
    enunciado: `A empresa Gama S/A foi condenada em 1ª instância a pagar horas extras a Lucas Costa, com base em cartões de ponto que a empresa alega terem sido adulterados pelo próprio empregado. A empresa deseja recorrer da sentença. Redija o recurso cabível como advogado(a) da empresa.`,
    partes: { polo_ativo: 'Gama S/A (recorrente)', polo_passivo: 'Lucas Costa (recorrido)' },
    fatos: 'Condenação em horas extras. Empresa alega adulteração dos cartões de ponto pelo empregado. Inversão do ônus da prova.',
    pedidos_sugeridos: [
      'Reforma da sentença para julgar improcedente o pedido de horas extras',
      'Subsidiariamente: redução do valor arbitrado',
    ],
    estrutura: {
      cabecalho: 'EGRÉGIO TRIBUNAL REGIONAL DO TRABALHO DA ___ REGIÃO',
      qualificacao: '[NOME DA RECORRENTE], já qualificada nos autos, vem interpor RECURSO ORDINÁRIO, nos termos do art. 895 da CLT.',
      dos_fatos: 'Resumo: reclamatória, sentença e seus fundamentos que merecem reforma.',
      do_direito: 'Art. 895 CLT. Art. 818 CLT e 373 CPC (ônus da prova do reclamante). Súmula 338 TST.',
      dos_pedidos: 'Provimento do recurso para reformar a sentença e julgar improcedente o pedido.',
      fechamento: '[Local], [data]. [Nome do Advogado], OAB/__ nº ___.',
    },
  },
]

// ─── DIREITO TRIBUTÁRIO ───────────────────────────────────────────────────────
// Mandado de Segurança: 8x. Agravo: 7x. Apelação: 7x.
export const casosTributario: CasoPratico[] = [
  {
    id: 'tributario-001',
    area: 'Direito Tributário',
    peca: 'Mandado de Segurança',
    frequencia: 8,
    enunciado: `A empresa Delta Comércio Ltda. recebeu auto de infração para pagamento de ICMS sobre operações que entende serem imunes (exportações diretas para o exterior). O Fisco estadual negou o pedido administrativo de cancelamento. A empresa deseja questionar judicialmente a cobrança com urgência para evitar a inscrição em dívida ativa. Redija a peça adequada.`,
    partes: { polo_ativo: 'Delta Comércio Ltda. (impetrante)', polo_passivo: 'Secretário Estadual da Fazenda (impetrado)' },
    fatos: 'Auto de infração de ICMS sobre exportações. Imunidade constitucional (art. 155, §2º, X, "a" CF). Negativa administrativa. Risco de inscrição em dívida ativa.',
    pedidos_sugeridos: [
      'Concessão de liminar para suspender a exigibilidade do crédito tributário',
      'No mérito: concessão da segurança para anular o auto de infração',
      'Reconhecimento da imunidade tributária nas exportações',
    ],
    estrutura: {
      cabecalho: 'EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) DE DIREITO DA ___ VARA DA FAZENDA PÚBLICA DO ESTADO DE ___',
      qualificacao: '[NOME DA IMPETRANTE], pessoa jurídica de direito privado, CNPJ nº ___, vem impetrar MANDADO DE SEGURANÇA COM PEDIDO DE LIMINAR contra ato do [IMPETRADO], pelos fundamentos a seguir.',
      dos_fatos: 'Auto de infração, operações de exportação, imunidade constitucional, negativa administrativa e urgência.',
      do_direito: 'Art. 5º, LXIX CF. Art. 155, §2º, X, "a" CF (imunidade do ICMS nas exportações). Lei 12.016/2009. Art. 151, IV CTN (liminar como causa suspensiva).',
      dos_pedidos: 'Liminar para suspender a exigibilidade. No mérito, concessão da segurança para anular o lançamento.',
      fechamento: 'Dá-se à causa o valor de R$ ___. [Local], [data]. [Nome do Advogado], OAB/__ nº ___.',
    },
  },
]

// ─── DIREITO CONSTITUCIONAL ───────────────────────────────────────────────────
// Mandado de Segurança: 7x. ADI: 7x. Ação Popular: 5x.
export const casosConstitucional: CasoPratico[] = [
  {
    id: 'constitucional-001',
    area: 'Direito Constitucional',
    peca: 'Mandado de Segurança',
    frequencia: 7,
    enunciado: `O servidor público municipal Fábio Torres foi exonerado de cargo em comissão sem instauração de processo administrativo disciplinar. A Prefeitura alega que cargos em comissão são de livre nomeação e exoneração. Fábio, porém, exercia função de confiança há 12 anos e sustenta ter adquirido estabilidade. Redija a peça adequada como advogado(a) de Fábio.`,
    partes: { polo_ativo: 'Fábio Torres (impetrante)', polo_passivo: 'Prefeito Municipal (impetrado)' },
    fatos: 'Exoneração de cargo em comissão. 12 anos de exercício. Alegação de estabilidade e violação ao contraditório e ampla defesa.',
    pedidos_sugeridos: [
      'Liminar para reintegração imediata ao cargo',
      'No mérito: nulidade do ato de exoneração',
      'Reconhecimento do direito ao devido processo legal antes de qualquer demissão',
    ],
    estrutura: {
      cabecalho: 'EGRÉGIO TRIBUNAL DE JUSTIÇA DO ESTADO DE ___ (competência originária para ato de Prefeito)',
      qualificacao: '[NOME DO IMPETRANTE], servidor público, CPF nº ___, vem impetrar MANDADO DE SEGURANÇA COM PEDIDO DE LIMINAR contra ato do [IMPETRADO].',
      dos_fatos: 'Admissão, tempo de serviço, ato de exoneração, ausência de processo administrativo.',
      do_direito: 'Art. 5º, LXIX CF. Art. 41 CF (estabilidade). Art. 5º, LIV e LV CF (devido processo legal, contraditório e ampla defesa). Súmula 21 STF.',
      dos_pedidos: 'Liminar para reintegração. No mérito, nulidade da exoneração e reintegração definitiva.',
      fechamento: '[Local], [data]. [Nome do Advogado], OAB/__ nº ___.',
    },
  },
]

// ─── DIREITO ADMINISTRATIVO ───────────────────────────────────────────────────
// Apelação: 7x. Mandado de Segurança: 5x. Ação Ordinária: 3x.
export const casosAdministrativo: CasoPratico[] = [
  {
    id: 'administrativo-001',
    area: 'Direito Administrativo',
    peca: 'Mandado de Segurança',
    frequencia: 5,
    enunciado: `A empresa Epsilon Construções participou de licitação pública (concorrência) para obra de R$ 2 milhões. Foi inabilitada por exigência editalícia que a empresa entende ilegal: o edital exigia capital social mínimo de R$ 1 milhão, o que viola a Lei 8.666/93. Redija a peça adequada para questionar a inabilitação com urgência.`,
    partes: { polo_ativo: 'Epsilon Construções Ltda. (impetrante)', polo_passivo: 'Comissão de Licitação (impetrada)' },
    fatos: 'Licitação pública. Inabilitação por exigência ilegal (capital social mínimo). Violação à Lei 8.666/93.',
    pedidos_sugeridos: [
      'Liminar para suspender o certame',
      'No mérito: nulidade da cláusula editalícia e habilitação da impetrante',
    ],
    estrutura: {
      cabecalho: 'EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) DE DIREITO DA ___ VARA DA FAZENDA PÚBLICA DE ___',
      qualificacao: '[NOME DA IMPETRANTE], pessoa jurídica, CNPJ nº ___, vem impetrar MANDADO DE SEGURANÇA COM PEDIDO DE LIMINAR contra ato da Comissão de Licitação.',
      dos_fatos: 'Edital, participação, inabilitação indevida e ilegalidade da exigência.',
      do_direito: 'Art. 5º, LXIX CF. Art. 31, §1º da Lei 8.666/93 (vedação de exigência de capital mínimo superior ao necessário). Princípio da isonomia.',
      dos_pedidos: 'Liminar para suspender o certame. No mérito, nulidade da cláusula e habilitação da impetrante.',
      fechamento: '[Local], [data]. [Nome do Advogado], OAB/__ nº ___.',
    },
  },
]

// Mapa geral por área
export const CASOS_POR_AREA: Record<string, CasoPratico[]> = {
  'Direito Civil': casosCivil,
  'Direito Penal': casosPenal,
  'Direito do Trabalho': casosTrabalho,
  'Direito Tributário': casosTributario,
  'Direito Constitucional': casosConstitucional,
  'Direito Administrativo': casosAdministrativo,
}

export const AREAS_SEGUNDA_FASE = Object.keys(CASOS_POR_AREA)
