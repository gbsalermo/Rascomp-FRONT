/**
 * Inventário inicial baseado nas fontes versionadas da Landing de 13/10/2026:
 * HighlightsHero.vue, content/homeMedia.ts, content/events.ts,
 * TeamRobotsAwards.vue e RobotsShowcase.vue.
 *
 * Cópia para testes de editor, NÃO sincronizada com a Landing em tempo real.
 * No CMS persistente: importação idempotente por sourceId, depois somente API.
 */
export type SeedHero = {
  id: string
  sourceId: string
  title: string
  eyebrow: string
  description: string
  button: string
  destination: 'album' | 'gallery' | 'event' | 'section'
  target: string
  imagePath: string
  active: boolean
  existing: boolean
}
export const originalHeroSeeds: SeedHero[] = [
  {
    id: 'ras', sourceId: 'ras', eyebrow: 'IEEE RAS UFRB',
    title: 'Tecnologia, formação e comunidade em movimento.',
    description: 'Promovendo a robótica, a automação e a inovação por meio de projetos, oficinas, competições e ações de extensão na UFRB e na comunidade.',
    button: 'Conheça a RAS', destination: 'section', target: 'Sobre',
    imagePath: '/media/assets/institutional/ras-ufrb-geral.jpg', active: true, existing: true
  },
  {
    id: 'schools', sourceId: 'schools', eyebrow: 'RAS nas Escolas',
    title: 'Robótica e tecnologia mais perto da comunidade.',
    description: 'Ações de extensão aproximam estudantes da ciência, da engenharia e da robótica por meio de experiências práticas.',
    button: 'Ver ações', destination: 'section', target: 'Eventos',
    imagePath: '/media/assets/events/ras-nas-escolas.jpg', active: true, existing: true
  },
  {
    id: 'workshops', sourceId: 'workshops', eyebrow: 'Oficinas',
    title: 'Aprendizado prático para transformar ideias em projetos.',
    description: 'Oficinas, treinamentos e encontros técnicos conectam estudantes ao desenvolvimento de soluções em robótica e automação.',
    button: 'Ver oficinas', destination: 'section', target: 'Eventos',
    imagePath: '/media/assets/events/oficina-ras.jpg', active: true, existing: true
  },
  {
    id: 'awards', sourceId: 'awards', eyebrow: 'Conquistas',
    title: 'Resultados construídos em equipe.',
    description: 'Competições e premiações representam o desenvolvimento técnico, a colaboração e a evolução dos projetos do capítulo.',
    button: 'Ver conquistas', destination: 'section', target: 'Equipe e conquistas',
    imagePath: '/media/assets/awards/conquista-ras.jpg', active: true, existing: true
  }
]
export type SeedAward = {
  id: number; sourceId: string; title: string; place: string; event: string;
  year: string; detail: string; existing: boolean; active: boolean
}
export const originalAwardSeeds: SeedAward[] = [
  { id: 1, sourceId: 'award-1', title: 'RCX — Hockey', place: 'Vice-campeão', event: 'RCX 2024 · Categoria Hockey', year: '2024', detail: 'Vice-campeonato conquistado pela equipe na categoria Hockey da RCX.', existing: true, active: true },
  { id: 2, sourceId: 'award-2', title: 'ERBASE — Follow Line', place: 'Campeão e vice-campeão', event: 'ERBASE 2026 · Categoria Follow Line', year: '2026', detail: 'Campeonato e vice-campeonato conquistados pela equipe na categoria Follow Line durante a ERBASE 2026.', existing: true, active: true },
  { id: 3, sourceId: 'award-3', title: 'IEEE — Foto Destaque', place: 'Campeão', event: 'IEEE · Categoria Foto Destaque', year: '2024', detail: 'Reconhecimento de campeão na categoria Foto Destaque promovida pelo IEEE.', existing: true, active: true },
  { id: 4, sourceId: 'award-4', title: 'Mega Sumô', place: 'Campeão', event: 'Competição 2024 · Categoria Mega Sumô', year: '2024', detail: 'Título de campeão conquistado pela equipe na categoria Mega Sumô.', existing: true, active: true }
]
export type SeedEvent = {
  id: string; sourceId: string; title: string; date: string; endDate: string;
  description: string; location: string; type: string; existing: boolean; active: boolean
}
export const originalEventSeeds: SeedEvent[] = [
  { id: 'rcx-2026', sourceId: 'rcx-2026', title: 'RCX 2026', date: '2026-10-09', endDate: '2026-10-12', description: 'Entre 9 e 12 de outubro, a equipe participa da RCX 2026, levando seus robôs e representando a IEEE RAS UFRB na competição.', location: 'Informações em breve', type: 'Competições', existing: true, active: true },
  { id: 'congresso-ufrb-2026', sourceId: 'congresso-ufrb-2026', title: 'Apresentação de banners no Congresso UFRB', date: '2026-10-13', endDate: '2026-10-16', description: 'De 13 a 16 de outubro, integrantes da equipe participam do Congresso UFRB com apresentação de banners ligados às atividades e projetos desenvolvidos pelo grupo.', location: 'UFRB', type: 'Participações', existing: true, active: true },
  { id: 'rrc-2026', sourceId: 'rrc-2026', title: 'RRC 2026', date: '2026-11-14', endDate: '2026-11-14', description: 'A RRC 2026 acontece em 14 de novembro, reunindo equipes e robôs em uma programação voltada à competição e à integração da comunidade de robótica.', location: 'UFRB — Campus Cruz das Almas', type: 'Competições', existing: true, active: true }
]
export const existingRobotCategorySeeds = [
  { key: 'sumo', label: 'Sumô' }, { key: 'mini-sumo', label: 'Mini Sumô' },
  { key: 'hockey', label: 'Hockey' }, { key: 'follow-line', label: 'Follow Line' }
] as const
