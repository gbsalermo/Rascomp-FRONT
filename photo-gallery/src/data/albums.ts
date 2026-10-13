export type GalleryCategory = 'RRC' | 'Oficinas' | 'RAS nas Escolas' | 'Premiações' | 'Eventos'

export type GalleryPhoto = {
  id: string
  src?: string
  alt: string
  /** Somente fotos explicitamente publicadas podem integrar a Galeria. */
  published: boolean
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

// Imagens SVG geradas somente para testar a interface visual local.
// Elas NÃO são fotos reais nem conteúdo carregado do CMS.
const colors: Record<GalleryCategory, [string, string]> = {
  RRC: ['#384b74', '#bb687e'],
  Oficinas: ['#426a74', '#b89a79'],
  'RAS nas Escolas': ['#627492', '#d39d75'],
  Premiações: ['#6e3c78', '#bf648a'],
  Eventos: ['#446277', '#ba8c83']
}
function demonstrationImage(category: GalleryCategory, index: number): string {
  const [a,b] = colors[category]
  const shift = (index * 37) % 160
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 840 590">
    <defs><linearGradient id="g" x2="1" y2="1"><stop stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>
    <rect width="840" height="590" fill="url(#g)"/>
    <circle cx="${660-shift}" cy="80" r="210" fill="#ffffff" opacity=".075"/>
    <path d="M0 430 Q250 ${350+shift/2} 400 420 T840 390 V590 H0" fill="#1d1b38" opacity=".31"/>
    <g transform="translate(${145 + shift/4} 138)" stroke="#f8f0f5" stroke-width="14" fill="none" stroke-linejoin="round">
       <rect x="45" y="135" width="395" height="205" rx="38" fill="#ffffff" fill-opacity=".075"/>
       <rect x="142" y="40" width="195" height="105" rx="26" fill="#ffffff" fill-opacity=".10"/>
       <path d="M240 40 V-4 M222 -5 h36 M45 215H-20M440 215h65"/>
       <circle cx="145" cy="232" r="29" fill="#ffffff" fill-opacity=".28"/>
       <circle cx="337" cy="232" r="29" fill="#ffffff" fill-opacity=".28"/>
       <path d="M172 294 Q239 333 310 293"/>
    </g>
    <rect x="26" y="26" width="788" height="538" rx="22" fill="none" stroke="#ffffff" stroke-opacity=".15" stroke-width="3"/>
  </svg>`
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg)
}
function demonstrationPhotos(slug: string, title: string, category: GalleryCategory, amount = 8): GalleryPhoto[] {
  return Array.from({length:amount}, (_,index)=>({
    id: slug + '-' + (index + 1),
    alt: 'Registro ilustrativo de ' + title,
    published: true, // Exemplos autorizados do protótipo; imagens internas da Gestão NÃO entram aqui.
    src: demonstrationImage(category, index)
  }))
}
const seed: Array<Omit<GalleryAlbum,'photos'|'cover'|'count'>> = [
  { slug:'rrc-2026', title:'RRC 2026', category:'RRC', description:'Robôs, arenas e equipes em uma competição de robótica.', date:'Competições' },
  { slug:'oficina-de-robotica', title:'Oficina de Robótica', category:'Oficinas', description:'Aprendizado prático e compartilhamento de conhecimento.', date:'Oficinas' },
  { slug:'ras-nas-escolas', title:'RAS nas Escolas', category:'RAS nas Escolas', description:'Encontros de tecnologia e ciência com a comunidade.', date:'Extensão' },
  { slug:'conquistas-e-premiacoes', title:'Conquistas e Premiações', category:'Premiações', description:'Momentos importantes da trajetória da equipe.', date:'Conquistas' },
  { slug:'eventos-institucionais', title:'Eventos Institucionais', category:'Eventos', description:'Palestras, atividades e integração da RAS UFRB.', date:'Eventos' }
]
export const albums: GalleryAlbum[] = seed.map(item => {
  const photos = demonstrationPhotos(item.slug, item.title, item.category).filter(photo=>photo.published === true)
  return { ...item, photos, cover: photos[0]?.src, count: photos.length }
})

export function findAlbum(slug?: string | string[]) {
  const value = Array.isArray(slug) ? slug[0] : slug
  return albums.find(album => album.slug === value)
}
