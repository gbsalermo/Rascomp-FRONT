import congressoImage from '../assets/congresso.png'
import rcxImage from '../assets/rcx.jpg'
import rrcImage from '../assets/rrc.jpeg'

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
  startDate: string
  endDate: string
  location: string
  summary: string
  description: string
  status?: string
  temporalLabel: 'Próximo' | 'Inscrições abertas' | 'Em breve'
  tone: EventTone
  cta?: string
  href?: string
  image: string
}

export type RecentLandingEvent = {
  id: string
  title: string
  category: 'Competição' | 'Oficina' | 'Evento'
  dateLabel: string
  summary: string
  image: string
  tone: EventTone
}

export const LANDING_EVENTS: LandingEvent[] = [
  {
    id: 'rcx-2026',
    title: 'RCX 2026',
    eyebrow: 'Competição de Robótica',
    type: 'Competições',
    organizedByRas: false,
    dateDay: '09',
    dateMonth: 'OUT',
    dateLabel: '09 a 12 OUT 2026',
    startDate: '2026-10-09',
    endDate: '2026-10-12',
    location: 'Informações em breve',
    summary: 'Participação da equipe na RCX 2026.',
    description: 'Entre 9 e 12 de outubro, a equipe participa da RCX 2026, levando seus robôs e representando a IEEE RAS UFRB na competição.',
    temporalLabel: 'Próximo',
    tone: 'red',
    image: rcxImage
  },
  {
    id: 'congresso-ufrb-2026',
    title: 'Apresentação de banners no Congresso UFRB',
    eyebrow: 'Congresso UFRB',
    type: 'Participações',
    organizedByRas: false,
    dateDay: '13',
    dateMonth: 'OUT',
    dateLabel: '13 a 16 OUT 2026',
    startDate: '2026-10-13',
    endDate: '2026-10-16',
    location: 'UFRB',
    summary: 'Apresentação de banners durante o Congresso UFRB.',
    description: 'De 13 a 16 de outubro, integrantes da equipe participam do Congresso UFRB com apresentação de banners ligados às atividades e projetos desenvolvidos pelo grupo.',
    temporalLabel: 'Próximo',
    tone: 'blue',
    image: congressoImage
  },
  {
    id: 'rrc-2026',
    title: 'RRC 2026',
    eyebrow: 'Competição de Robótica',
    type: 'Competições',
    organizedByRas: true,
    dateDay: '14',
    dateMonth: 'NOV',
    dateLabel: '14 NOV 2026',
    startDate: '2026-11-14',
    endDate: '2026-11-14',
    location: 'UFRB — Campus Cruz das Almas',
    summary: 'Competição de robótica marcada para 14 de novembro.',
    description: 'A RRC 2026 acontece em 14 de novembro, reunindo equipes e robôs em uma programação voltada à competição e à integração da comunidade de robótica.',
    temporalLabel: 'Em breve',
    tone: 'purple',
    image: rrcImage
  }
]

// Sem registros históricos fictícios: a seção de recentes só volta quando houver
// eventos concluídos e dados/fotos reais para publicar.
export const RECENT_LANDING_EVENTS: RecentLandingEvent[] = []

/**
 * Datas são comparadas no calendário brasileiro (America/Bahia),
 * inclusive início e fim. O status não depende de rótulos editoriais.
 */
export type EventPeriod = 'upcoming' | 'ongoing' | 'past'

export function eventPeriod(event: Pick<LandingEvent, 'startDate' | 'endDate'>, today: string): EventPeriod {
  if (today < event.startDate) return 'upcoming'
  if (today > event.endDate) return 'past'
  return 'ongoing'
}
