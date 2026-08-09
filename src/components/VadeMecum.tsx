'use client'

import { useState } from 'react'

interface Artigo {
  numero: string
  texto: string
}

interface SecaoVade {
  titulo: string
  artigos: Artigo[]
}

interface LeiVade {
  nome: string
  sigla: string
  artigos: SecaoVade[]
}

const VADE_MECUM: LeiVade[] = [
  {
    nome: 'Código Civil',
    sigla: 'CC',
    artigos: [
      {
        titulo: 'Contratos em Geral',
        artigos: [
          { numero: 'Art. 389', texto: 'Não cumprida a obrigação, responde o devedor por perdas e danos, mais juros e atualização monetária segundo índices oficiais regularmente estabelecidos, e honorários de advogado.' },
          { numero: 'Art. 475', texto: 'A parte lesada pelo inadimplemento pode pedir a resolução do contrato, se não preferir exigir-lhe o cumprimento, cabendo, em qualquer dos casos, indenização por perdas e danos.' },
          { numero: 'Art. 478', texto: 'Nos contratos de execução continuada ou diferida, se a prestação de uma das partes se tornar excessivamente onerosa, com extrema vantagem para a outra, em virtude de acontecimentos extraordinários e imprevisíveis, poderá o devedor pedir a resolução do contrato.' },
          { numero: 'Art. 421', texto: 'A liberdade contratual será exercida nos limites da função social do contrato.' },
          { numero: 'Art. 422', texto: 'Os contratantes são obrigados a guardar, assim na conclusão do contrato, como em sua execução, os princípios de probidade e boa-fé.' },
        ],
      },
      {
        titulo: 'Responsabilidade Civil',
        artigos: [
          { numero: 'Art. 927', texto: 'Aquele que, por ato ilícito (arts. 186 e 187), causar dano a outrem, fica obrigado a repará-lo. Parágrafo único: haverá obrigação de reparar o dano, independentemente de culpa, nos casos especificados em lei, ou quando a atividade normalmente desenvolvida pelo autor do dano implicar, por sua natureza, risco para os direitos de outrem.' },
          { numero: 'Art. 186', texto: 'Aquele que, por ação ou omissão voluntária, negligência ou imprudência, violar direito e causar dano a outrem, ainda que exclusivamente moral, comete ato ilícito.' },
          { numero: 'Art. 944', texto: 'A indenização mede-se pela extensão do dano.' },
        ],
      },
      {
        titulo: 'Família e Alimentos',
        artigos: [
          { numero: 'Art. 1.694', texto: 'Podem os parentes, os cônjuges ou companheiros pedir uns aos outros os alimentos de que necessitem para viver de modo compatível com a sua condição social, inclusive para atender às necessidades de sua educação.' },
          { numero: 'Art. 1.696', texto: 'O direito à prestação de alimentos é recíproco entre pais e filhos, e extensivo a todos os ascendentes, recaindo a obrigação nos mais próximos em grau, uns em falta de outros.' },
        ],
      },
    ],
  },
  {
    nome: 'Código de Processo Civil',
    sigla: 'CPC',
    artigos: [
      {
        titulo: 'Petição Inicial',
        artigos: [
          { numero: 'Art. 319', texto: 'A petição inicial indicará: I – o juízo a que é dirigida; II – os nomes, os prenomes, o estado civil, a existência de união estável, a profissão, o número de inscrição no CPF ou CNPJ...; III – o fato e os fundamentos jurídicos do pedido; IV – o pedido com suas especificações; V – o valor da causa; VI – as provas com que o autor pretende demonstrar a verdade dos fatos alegados; VII – a opção do autor pela realização ou não de audiência de conciliação ou de mediação.' },
          { numero: 'Art. 330', texto: 'A petição inicial será indeferida quando: I – for inepta; II – a parte for manifestamente ilegítima; III – o autor carecer de interesse processual.' },
        ],
      },
      {
        titulo: 'Recursos',
        artigos: [
          { numero: 'Art. 1.009', texto: 'Da sentença cabe apelação. §1º As questões resolvidas na fase de conhecimento, se a decisão a seu respeito não comportar agravo de instrumento, não são cobertas pela preclusão e devem ser suscitadas em preliminar de apelação eventualmente interposta ou nas contrarrazões.' },
          { numero: 'Art. 1.010', texto: 'A apelação, interposta por petição dirigida ao juízo de primeiro grau, conterá: I – os nomes e a qualificação das partes; II – a exposição do fato e do direito; III – as razões do pedido de reforma ou de decretação de nulidade; IV – o pedido de nova decisão.' },
          { numero: 'Art. 1.015', texto: 'Cabe agravo de instrumento contra as decisões interlocutórias que versarem sobre: I – tutelas provisórias; II – mérito do processo; III – rejeição da alegação de convenção de arbitragem...' },
        ],
      },
      {
        titulo: 'Tutela de Urgência',
        artigos: [
          { numero: 'Art. 300', texto: 'A tutela de urgência será concedida quando houver elementos que evidenciem a probabilidade do direito e o perigo de dano ou o risco ao resultado útil do processo.' },
          { numero: 'Art. 301', texto: 'A tutela de urgência de natureza cautelar pode ser efetivada mediante arresto, sequestro, arrolamento de bens, registro de protesto contra alienação de bem e qualquer outra medida idônea para asseguração do direito.' },
        ],
      },
    ],
  },
  {
    nome: 'Código Penal',
    sigla: 'CP',
    artigos: [
      {
        titulo: 'Dosimetria da Pena',
        artigos: [
          { numero: 'Art. 59', texto: 'O juiz, atendendo à culpabilidade, aos antecedentes, à conduta social, à personalidade do agente, aos motivos, às circunstâncias e consequências do crime, bem como ao comportamento da vítima, estabelecerá, conforme seja necessário e suficiente para reprovação e prevenção do crime.' },
          { numero: 'Art. 68', texto: 'A pena-base será fixada atendendo-se ao critério do art. 59 deste Código; em seguida serão consideradas as circunstâncias atenuantes e agravantes; por último, as causas de diminuição e de aumento.' },
        ],
      },
      {
        titulo: 'Crimes Patrimoniais',
        artigos: [
          { numero: 'Art. 155', texto: 'Subtrair, para si ou para outrem, coisa alheia móvel: Pena – reclusão, de um a quatro anos, e multa. §4º A pena é de reclusão de dois a oito anos, e multa, se o crime é cometido: I – com destruição ou rompimento de obstáculo; II – com abuso de confiança, ou mediante fraude, escalada ou destreza; III – com emprego de chave falsa; IV – mediante concurso de duas ou mais pessoas.' },
          { numero: 'Art. 171', texto: 'Obter, para si ou para outrem, vantagem ilícita, em prejuízo alheio, induzindo ou mantendo alguém em erro, mediante artifício, ardil, ou qualquer outro meio fraudulento: Pena – reclusão, de um a cinco anos, e multa.' },
        ],
      },
      {
        titulo: 'Concurso de Pessoas',
        artigos: [
          { numero: 'Art. 29', texto: 'Quem, de qualquer modo, concorre para o crime incide nas penas a este cominadas, na medida de sua culpabilidade. §1º Se a participação for de menor importância, a pena pode ser diminuída de um sexto a um terço.' },
        ],
      },
    ],
  },
  {
    nome: 'CLT',
    sigla: 'CLT',
    artigos: [
      {
        titulo: 'Rescisão e Verbas',
        artigos: [
          { numero: 'Art. 487', texto: 'Não havendo prazo estipulado, a parte que, sem justo motivo, quiser rescindir o contrato deverá avisar a outra da sua resolução com a antecedência mínima de: I – oito dias, se o pagamento for efetuado por semana ou tempo inferior; II – trinta dias aos que perceberem por quinzena ou mês, ou que tenham mais de 12 (doze) meses de serviço na empresa.' },
          { numero: 'Art. 477', texto: 'Na extinção do contrato de trabalho, o empregador deverá proceder à anotação na Carteira de Trabalho e Previdência Social, comunicar a dispensa aos órgãos competentes e realizar o pagamento das verbas rescisórias dentro do prazo e na forma estabelecida neste artigo.' },
        ],
      },
      {
        titulo: 'Jornada e Horas Extras',
        artigos: [
          { numero: 'Art. 59', texto: 'A duração diária do trabalho poderá ser acrescida de horas extras, em número não excedente de duas, por acordo individual, convenção coletiva ou acordo coletivo de trabalho.' },
          { numero: 'Art. 818', texto: 'O ônus de provar o alegado em juízo incumbe: I – ao reclamante, quanto ao fato constitutivo de seu direito; II – ao reclamado, quanto à existência de fato impeditivo, modificativo ou extintivo do direito do reclamante.' },
        ],
      },
    ],
  },
  {
    nome: 'Constituição Federal',
    sigla: 'CF/88',
    artigos: [
      {
        titulo: 'Direitos Fundamentais',
        artigos: [
          { numero: 'Art. 5º, LXIX', texto: 'Conceder-se-á mandado de segurança para proteger direito líquido e certo, não amparado por habeas corpus ou habeas data, quando o responsável pela ilegalidade ou abuso de poder for autoridade pública ou agente de pessoa jurídica no exercício de atribuições do Poder Público.' },
          { numero: 'Art. 5º, LIV', texto: 'Ninguém será privado da liberdade ou de seus bens sem o devido processo legal.' },
          { numero: 'Art. 5º, LV', texto: 'Aos litigantes, em processo judicial ou administrativo, e aos acusados em geral são assegurados o contraditório e ampla defesa, com os meios e recursos a ela inerentes.' },
        ],
      },
      {
        titulo: 'Servidor Público',
        artigos: [
          { numero: 'Art. 41', texto: 'São estáveis após três anos de efetivo exercício os servidores nomeados para cargo de provimento efetivo em virtude de concurso público. §1º O servidor público estável só perderá o cargo: I – em virtude de sentença judicial transitada em julgado; II – mediante processo administrativo em que lhe seja assegurada ampla defesa; III – mediante procedimento de avaliação periódica de desempenho...' },
        ],
      },
      {
        titulo: 'Tributário',
        artigos: [
          { numero: 'Art. 155, §2º, X, "a"', texto: 'O ICMS não incidirá sobre operações que destinem mercadorias para o exterior, nem sobre serviços prestados a destinatários no exterior, assegurada a manutenção e o aproveitamento do montante do imposto cobrado nas operações e prestações anteriores.' },
          { numero: 'Art. 150, I', texto: 'Sem prejuízo de outras garantias asseguradas ao contribuinte, é vedado à União, aos Estados, ao Distrito Federal e aos Municípios exigir ou aumentar tributo sem lei que o estabeleça.' },
        ],
      },
    ],
  },
  {
    nome: 'CTN',
    sigla: 'CTN',
    artigos: [
      {
        titulo: 'Suspensão do Crédito',
        artigos: [
          { numero: 'Art. 151', texto: 'Suspendem a exigibilidade do crédito tributário: I – moratória; II – o depósito do seu montante integral; III – as reclamações e os recursos, nos termos das leis reguladoras do processo tributário administrativo; IV – a concessão de medida liminar em mandado de segurança; V – a concessão de medida liminar ou de tutela antecipada, em outras espécies de ação judicial; VI – o parcelamento.' },
        ],
      },
      {
        titulo: 'Lançamento',
        artigos: [
          { numero: 'Art. 142', texto: 'Compete privativamente à autoridade administrativa constituir o crédito tributário pelo lançamento, assim entendido o procedimento administrativo tendente a verificar a ocorrência do fato gerador da obrigação correspondente, determinar a matéria tributável, calcular o montante do tributo devido, identificar o sujeito passivo e, sendo caso, propor a aplicação da penalidade cabível.' },
        ],
      },
    ],
  },
]

interface Props {
  onFechar: () => void
}

export default function VadeMecum({ onFechar }: Props) {
  const [leiAtiva, setLeiAtiva] = useState(0)
  const [busca, setBusca] = useState('')

  const lei = VADE_MECUM[leiAtiva]

  // Filtra artigos pela busca
  const secoesFiltradas = lei.artigos.map(secao => ({
    ...secao,
    artigos: secao.artigos.filter(a =>
      busca === '' ||
      a.numero.toLowerCase().includes(busca.toLowerCase()) ||
      a.texto.toLowerCase().includes(busca.toLowerCase())
    ),
  })).filter(s => s.artigos.length > 0)

  return (
    <div className="flex flex-col h-full" style={{ background: '#1a1a2e' }}>

      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div>
          <p className="text-white font-bold text-sm">⚖ Vade Mecum</p>
          <p className="text-white/50 text-xs">Consulta rápida</p>
        </div>
        <button onClick={onFechar} className="text-white/50 hover:text-white text-lg transition-colors">✕</button>
      </div>

      {/* Busca */}
      <div className="p-3 border-b border-white/10">
        <input
          type="text"
          value={busca}
          onChange={e => setBusca(e.target.value)}
          placeholder="Buscar artigo ou texto..."
          className="w-full px-3 py-2 rounded-lg text-xs text-white placeholder-white/30 border border-white/20 focus:outline-none focus:border-blue-400"
          style={{ background: 'rgba(255,255,255,0.08)' }}
        />
      </div>

      {/* Abas das leis */}
      <div className="flex gap-1 p-2 border-b border-white/10 overflow-x-auto">
        {VADE_MECUM.map((l, i) => (
          <button key={l.sigla} onClick={() => { setLeiAtiva(i); setBusca('') }}
            className="px-2 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0"
            style={{
              background: leiAtiva === i ? '#0070f3' : 'rgba(255,255,255,0.08)',
              color: leiAtiva === i ? 'white' : 'rgba(255,255,255,0.6)',
            }}>
            {l.sigla}
          </button>
        ))}
      </div>

      {/* Conteúdo */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {secoesFiltradas.length === 0 ? (
          <p className="text-white/40 text-xs text-center py-8">Nenhum resultado encontrado.</p>
        ) : (
          secoesFiltradas.map(secao => (
            <div key={secao.titulo}>
              <p className="text-xs font-bold text-blue-400 mb-2 uppercase tracking-wider">{secao.titulo}</p>
              <div className="space-y-2">
                {secao.artigos.map(artigo => (
                  <div key={artigo.numero} className="rounded-lg p-3" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <p className="text-xs font-bold text-white mb-1">{artigo.numero}</p>
                    <p className="text-xs text-white/70 leading-relaxed">{artigo.texto}</p>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
