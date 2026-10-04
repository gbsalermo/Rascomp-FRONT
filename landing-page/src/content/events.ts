export type EventTone = 'red' | 'purple' | 'blue' | 'green'

export type LandingEvent = {
  id: string
  title: string
  eyebrow: string
  type: 'Participações' | 'Oficinas' | 'Palestras' | 'Competições' | 'Projeto Social'
  organizedByRas: boolean
  dateDay: string
  dateMonth: string
  dateLabel: string
  location: string
  summary: string
  status?: string
  tone: EventTone
  cta: string
}

export const LANDING_EVENTS: LandingEvent[] = [
  {
    id: 'rrc-2026',
    title: 'RRC 2026',
    eyebrow: 'Competição de Robótica',
    type: 'Competições',
    organizedByRas: true,
    dateDay: '07',
    dateMonth: 'NOV',
    dateLabel: '07 a 10 NOV 2026',
    location: 'UFRB — Campus Cruz das Almas',
    summary: 'Desafios, inovação e muita tecnologia em uma das principais ações competitivas promovidas pelo capítulo.',
    status: 'Destaque',
    tone: 'red',
    cta: 'Saiba mais'
  },
  {
    id: 'oficina-arduino',
    title: 'Oficina Arduino',
    eyebrow: 'Do básico ao projeto',
    type: 'Oficinas',
    organizedByRas: true,
    dateDay: '12',
    dateMonth: 'SET',
    dateLabel: '12 SET 2026',
    location: 'Lab. de Robótica — UFRB',
    summary: 'Uma atividade prática para apresentar fundamentos de eletrônica, programação e prototipagem com Arduino.',
    status: 'Inscrições abertas',
    tone: 'purple',
    cta: 'Inscrever-se'
  },
  {
    id: 'palestra-ia',
    title: 'Palestra: IA na Robótica',
    eyebrow: 'Inteligência Artificial na Robótica',
    type: 'Palestras',
    organizedByRas: true,
    dateDay: '28',
    dateMonth: 'AGO',
    dateLabel: '28 AGO 2026',
    location: 'Auditório do CETEC — UFRB',
    summary: 'Conversa com convidados sobre aplicações atuais de inteligência artificial, automação e robótica.',
    tone: 'blue',
    cta: 'Saiba mais'
  },
  {
    id: 'ras-escolas',
    title: 'RAS nas Escolas',
    eyebrow: 'Inspirando o futuro',
    type: 'Projeto Social',
    organizedByRas: true,
    dateDay: '18',
    dateMonth: 'SET',
    dateLabel: '18 SET 2026',
    location: 'Escolas públicas — Cruz das Almas',
    summary: 'Levamos experiências de robótica e tecnologia para aproximar estudantes de ciência, engenharia e programação.',
    tone: 'green',
    cta: 'Saiba mais'
  },
  {
    id: 'robodori',
    title: 'Robodori',
    eyebrow: 'Robótica e integração',
    type: 'Participações',
    organizedByRas: true,
    dateDay: '05',
    dateMonth: 'OUT',
    dateLabel: '05 OUT 2026',
    location: 'Local a confirmar',
    summary: 'Espaço reservado para apresentar o Robodori e seus destaques quando o material oficial estiver consolidado.',
    tone: 'purple',
    cta: 'Ver detalhes'
  },
  {
    id: 'competicao-externa',
    title: 'Participação em competição externa',
    eyebrow: 'Representando a RAS UFRB',
    type: 'Participações',
    organizedByRas: false,
    dateDay: '22',
    dateMonth: 'OUT',
    dateLabel: '22 OUT 2026',
    location: 'Local a confirmar',
    summary: 'Registro para participações da equipe em competições, mostras e encontros promovidos por outras instituições.',
    tone: 'red',
    cta: 'Ver participação'
  }
]
