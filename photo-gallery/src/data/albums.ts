export type GalleryCategory = 'RRC' | 'Oficinas' | 'RAS nas Escolas' | 'Premiações' | 'Eventos'

export type GalleryPhoto = {
  id: string
  src?: string
  alt: string
}

export type GalleryAlbum = {
  slug: string
  title: string
  category: GalleryCategory
  description: string
  date: string
  count: number
  cover?: string
  photos: GalleryPhoto[]
}

function placeholders(slug: string, title: string, amount = 12): GalleryPhoto[] {
  return Array.from({ length: amount }, (_, index) => ({
    id: `${slug}-${index + 1}`,
    alt: `${title} — foto ${index + 1}`
  }))
}

export const albums: GalleryAlbum[] = [
  {
    slug: 'rrc-2026',
    title: 'RRC 2026',
    category: 'RRC',
    description: 'Momentos das edições do RRC e da nossa equipe em ação dentro e fora das pistas.',
    date: '11–13 abr. 2026',
    count: 48,
    photos: placeholders('rrc-2026', 'RRC 2026')
  },
  {
    slug: 'oficina-de-robotica',
    title: 'Oficina de Robótica',
    category: 'Oficinas',
    description: 'Capacitação, aprendizado e compartilhamento de conhecimento com a comunidade.',
    date: '22 mai. 2026',
    count: 32,
    photos: placeholders('oficina-de-robotica', 'Oficina de Robótica')
  },
  {
    slug: 'ras-nas-escolas',
    title: 'RAS nas Escolas',
    category: 'RAS nas Escolas',
    description: 'Tecnologia, inspiração e ciência em atividades realizadas com escolas da região.',
    date: '03 jun. 2026',
    count: 27,
    photos: placeholders('ras-nas-escolas', 'RAS nas Escolas')
  },
  {
    slug: 'conquistas-e-premiacoes',
    title: 'Conquistas e Premiações',
    category: 'Premiações',
    description: 'Registros de conquistas que representam trabalho, dedicação e evolução técnica.',
    date: '2025–2026',
    count: 41,
    photos: placeholders('conquistas-e-premiacoes', 'Conquistas e Premiações')
  },
  {
    slug: 'eventos-institucionais',
    title: 'Eventos Institucionais',
    category: 'Eventos',
    description: 'Palestras, workshops, integrações e momentos que fortalecem a comunidade da RAS UFRB.',
    date: '2025–2026',
    count: 36,
    photos: placeholders('eventos-institucionais', 'Eventos Institucionais')
  }
]

export function findAlbum(slug?: string | string[]) {
  const value = Array.isArray(slug) ? slug[0] : slug
  return albums.find((album) => album.slug === value)
}
