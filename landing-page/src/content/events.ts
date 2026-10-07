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
    id: 'rrc-2026',
    title: 'RRC 2026',
    eyebrow: 'Competição de Robótica',
    type: 'Competições',
    organizedByRas: true,
    dateDay: '07',
    dateMonth: 'NOV',
    dateLabel: '07 a 10 NOV 2026',
    location: 'UFRB — Campus Cruz das Almas',
    summary: 'Desafios, inovação e tecnologia em uma das principais ações competitivas promovidas pelo capítulo.',
    description: 'A RoboCup Regional Competition (RRC) reúne equipes de diferentes instituições em desafios de robótica, estratégia e inovação. A RAS UFRB participa da organização e das atividades competitivas do evento.',
    status: 'Destaque',
    temporalLabel: 'Próximo',
    tone: 'red',
    image: '/media/assets/awards/conquista-ras.jpg'
  },
  {
    id: 'oficina-arduino',
    title: 'Oficina Arduino',
    eyebrow: 'Do básico ao projeto',
    type: 'Oficinas',
    organizedByRas: true,
    dateDay: '12',
    dateMonth: 'OUT',
    dateLabel: '12 OUT 2026',
    location: 'Lab. de Robótica — UFRB',
    summary: 'Uma atividade prática para apresentar fundamentos de eletrônica, programação e prototipagem com Arduino.',
    description: 'A oficina apresenta conceitos básicos de eletrônica e programação por meio de atividades práticas. A proposta é permitir que participantes sem experiência prévia construam e testem pequenos projetos com Arduino.',
    status: 'Inscrições abertas',
    temporalLabel: 'Inscrições abertas',
    tone: 'purple',
    cta: 'Inscrever-se',
    image: '/media/assets/events/oficina-ras.jpg'
  },
  {
    id: 'palestra-ia',
    title: 'Palestra: IA na Robótica',
    eyebrow: 'Inteligência Artificial',
    type: 'Palestras',
    organizedByRas: true,
    dateDay: '28',
    dateMonth: 'OUT',
    dateLabel: '28 OUT 2026',
    location: 'Auditório do CETEC — UFRB',
    summary: 'Conversa com convidados sobre aplicações atuais de inteligência artificial, automação e robótica.',
    description: 'Uma conversa introdutória sobre inteligência artificial aplicada à robótica, passando por percepção, tomada de decisão e automação. O encontro também abre espaço para perguntas e troca de experiências.',
    temporalLabel: 'Em breve',
    tone: 'blue',
    image: '/media/assets/institutional/ras-ufrb-geral.jpg'
  },
  {
    id: 'ras-escolas',
    title: 'RAS nas Escolas',
    eyebrow: 'Projeto Social',
    type: 'Projeto Social',
    organizedByRas: true,
    dateDay: '18',
    dateMonth: 'OUT',
    dateLabel: '18 OUT 2026',
    location: 'Escolas públicas — Cruz das Almas',
    summary: 'Levamos experiências de robótica e tecnologia para aproximar estudantes de ciência, engenharia e programação.',
    description: 'A ação leva atividades demonstrativas e experiências práticas para escolas da região, aproximando estudantes de robótica, programação, engenharia e tecnologia de maneira acessível.',
    temporalLabel: 'Em breve',
    tone: 'green',
    cta: 'Ver registros',
    href: '#galeria',
    image: '/media/assets/events/ras-nas-escolas.jpg'
  },
  {
    id: 'robodori',
    title: 'Robodori',
    eyebrow: 'Robótica e integração',
    type: 'Participações',
    organizedByRas: true,
    dateDay: '05',
    dateMonth: 'NOV',
    dateLabel: '05 NOV 2026',
    location: 'Local a confirmar',
    summary: 'Encontro de robótica, integração e demonstração de projetos desenvolvidos pelo capítulo.',
    description: 'Espaço de integração entre estudantes, projetos e iniciativas de robótica, com demonstrações e troca de experiências entre participantes.',
    temporalLabel: 'Em breve',
    tone: 'purple',
    image: '/media/assets/institutional/ras-ufrb-geral.jpg'
  },
  {
    id: 'competicao-externa',
    title: 'Participação em competição externa',
    eyebrow: 'Representando a RAS UFRB',
    type: 'Participações',
    organizedByRas: false,
    dateDay: '22',
    dateMonth: 'NOV',
    dateLabel: '22 NOV 2026',
    location: 'Local a confirmar',
    summary: 'Participação da equipe em competições e encontros promovidos por outras instituições.',
    description: 'Registro destinado às participações externas da equipe, incluindo competições, mostras técnicas e encontros promovidos por instituições parceiras.',
    temporalLabel: 'Em breve',
    tone: 'red',
    image: '/media/assets/awards/conquista-ras.jpg'
  }
]

export const RECENT_LANDING_EVENTS: RecentLandingEvent[] = [
  {
    id: 'erbase-2026',
    title: 'ERBASE 2026',
    category: 'Competição',
    dateLabel: '2026',
    summary: 'Campeão e vice-campeão na categoria Follow Line.',
    image: '/media/assets/awards/conquista-ras.jpg',
    tone: 'purple'
  },
  {
    id: 'rcx-2024',
    title: 'RCX 2024',
    category: 'Competição',
    dateLabel: '2024',
    summary: 'Vice-campeão na categoria Hockey.',
    image: '/media/assets/institutional/ras-ufrb-geral.jpg',
    tone: 'red'
  },
  {
    id: 'workshop-robotica',
    title: 'Workshop de Robótica',
    category: 'Oficina',
    dateLabel: '2024',
    summary: 'Oficina prática para novos membros.',
    image: '/media/assets/events/oficina-ras.jpg',
    tone: 'green'
  },
  {
    id: 'semana-engenharia',
    title: 'Semana da Engenharia',
    category: 'Evento',
    dateLabel: '2024',
    summary: 'Participação com estande e demonstrações.',
    image: '/media/assets/events/ras-nas-escolas.jpg',
    tone: 'blue'
  }
]
