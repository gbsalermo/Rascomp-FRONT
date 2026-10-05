export type HomeMediaSlot = {
  src: string
  alt: string
}

export const HOME_MEDIA = {
  hero: {
    ras: {
      src: '/media/assets/institutional/ras-ufrb-geral.jpg',
      alt: 'Atividade da IEEE RAS UFRB'
    },
    schools: {
      src: '/media/assets/events/ras-nas-escolas.jpg',
      alt: 'Atividade do projeto RAS nas Escolas'
    },
    workshops: {
      src: '/media/assets/events/oficina-ras.jpg',
      alt: 'Oficina promovida pela IEEE RAS UFRB'
    },
    awards: {
      src: '/media/assets/awards/conquista-ras.jpg',
      alt: 'Equipe da IEEE RAS UFRB em premiação'
    }
  },
  about: {
    team: {
      src: '/media/assets/institutional/ras-ufrb-geral.jpg',
      alt: 'Equipe da IEEE RAS UFRB reunida em atividade institucional'
    },
    projects: {
      src: '/media/assets/events/oficina-ras.jpg',
      alt: 'Atividade de projetos e oficinas da IEEE RAS UFRB'
    },
    extension: {
      src: '/media/assets/events/ras-nas-escolas.jpg',
      alt: 'Ação de extensão da IEEE RAS UFRB'
    },
    achievements: {
      src: '/media/assets/awards/conquista-ras.jpg',
      alt: 'Equipe da IEEE RAS UFRB em competição e conquista'
    }
  }
} satisfies {
  hero: Record<'ras' | 'schools' | 'workshops' | 'awards', HomeMediaSlot>
  about: Record<'team' | 'projects' | 'extension' | 'achievements', HomeMediaSlot>
}

/**
 * Ponte temporária da V1-BETA A.
 *
 * Hoje:
 *   HOME_MEDIA -> /public/media/assets/** -> Landing
 *
 * Futuro (Gestão de Mídia):
 *   ContentSlot -> ContentItem -> MediaAsset -> storage/R2 -> Landing
 *
 * Os nomes dos slots conceituais devem permanecer estáveis para facilitar
 * a migração da origem estática para o CMS sem redesenhar os componentes.
 */
