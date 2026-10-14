import { computed, shallowRef } from 'vue'
import { albums as demonstrationAlbums, type GalleryAlbum, type GalleryPhoto } from './albums'

/**
 * Prévia editorial local: somente conteúdo autorizado explicitamente para Galeria
 * é enviado da Gestão. Em produção, um endpoint público deverá aplicar a mesma
 * regra no SERVIDOR, nunca apenas no frontend.
 */
export type PreviewAlbum = {
  id: number
  name: string
  description: string
  coverId?: number
}
export type PreviewPhoto = {
  id: number
  src: string
  albumIds: number[]
  published: true
  alt: string
}
export type GalleryDraft = { albums: PreviewAlbum[]; photos: PreviewPhoto[]; featuredPhotoIds?: number[] }
type GalleryCollection = { photos: GalleryPhoto[]; albums: GalleryAlbum[]; featuredPhotoIds: string[]; isPreview: boolean }
const draft = shallowRef<GalleryDraft | null>(null)
const temporaryUrls: string[] = []

export const galleryPreviewMode = import.meta.env.DEV
  && ['localhost', '127.0.0.1'].includes(window.location.hostname)
  && new URLSearchParams(window.location.search).get('rascomp_gallery_preview') === '1'

function clearTemporaryUrls() {
  for (const url of temporaryUrls) URL.revokeObjectURL(url)
  temporaryUrls.length = 0
}

function resolveSource(src: string, files: Record<string, Blob>): string {
  if (src.startsWith('rascomp-file:')) {
    const key = src.slice('rascomp-file:'.length)
    const image = files[key]
    if (!image || !image.type.startsWith('image/')) return ''
    const url = URL.createObjectURL(image)
    temporaryUrls.push(url)
    return url
  }
  // Apenas recursos do frontend de desenvolvimento são aceitos nesta prévia.
  if (/^http:\/\/(localhost|127\.0\.0\.1):5173\//.test(src)) return src
  return ''
}
export function startGalleryPreviewListener() {
  if (!galleryPreviewMode || !window.opener) return () => {}
  const opener = window.opener
  const token = new URLSearchParams(window.location.hash.slice(1)).get('preview')
  if (!token || !/^[a-f\d-]{30,60}$/i.test(token)) return () => {}
  const trustedOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173']
  const referrerOrigin = (() => {
    try { return new URL(document.referrer).origin } catch { return '' }
  })()
  const managementOrigin = trustedOrigins.includes(referrerOrigin)
    ? referrerOrigin
    : trustedOrigins[0]!

  function receive(event: MessageEvent) {
    if (event.source !== opener || !trustedOrigins.includes(event.origin)) return
    const data = event.data
    if (data?.type !== 'rascomp:gallery-draft' || data.token !== token) return
    if (!Array.isArray(data.draft?.photos) || !Array.isArray(data.draft?.albums)) return

    // Defesa em profundidade: o receptor volta a filtrar todas as fotos privadas.
    clearTemporaryUrls()
    const files: Record<string, Blob> = data.files || {}
    const photos: PreviewPhoto[] = data.draft.photos
      .filter((item: PreviewPhoto) => item.published === true && Array.isArray(item.albumIds))
      .slice(0, 400)
      .map((item: PreviewPhoto) => ({
        id: item.id,
        published: true as const,
        alt: 'Fotografia publicada pela IEEE RAS UFRB',
        src: resolveSource(item.src, files),
        albumIds: item.albumIds.filter((id:unknown) => typeof id === 'number'),
      }))
      .filter((item: PreviewPhoto) => Boolean(item.src))

    const allowed = new Set(photos.map(photo=>photo.id))
    draft.value = {
      photos,
      albums: data.draft.albums.filter((item: PreviewAlbum) => typeof item.id === 'number' && typeof item.name === 'string'),
      featuredPhotoIds: Array.isArray(data.draft.featuredPhotoIds)
        ? [...new Set((data.draft.featuredPhotoIds as unknown[])
            .filter((id):id is number=>typeof id==='number' && allowed.has(id)))].slice(0,3)
        : [],
    }
  }
  window.addEventListener('message', receive)
  opener.postMessage({ type: 'rascomp:gallery-ready', token }, managementOrigin)
  return () => { window.removeEventListener('message', receive); clearTemporaryUrls() }
}
export const galleryCollection = computed<GalleryCollection>(() => {
  if (galleryPreviewMode) {
    const data = draft.value ?? { photos: [], albums: [],featuredPhotoIds: [] }
    const photos: GalleryPhoto[] = data.photos.map(item => ({
      id: String(item.id), alt: item.alt, src: item.src, published: true,
    }))
    const byId = new Map(data.photos.map((photo) => [photo.id, photo]))
    const albums: GalleryAlbum[] = data.albums
      .map(album => {
        const published = photos.filter(photo => byId.get(Number(photo.id))?.albumIds.includes(album.id))
        const cover = published.find(photo => Number(photo.id) === album.coverId)?.src || published[0]?.src
        return {
          slug: String(album.id),
          title: album.name,
          category: 'Álbuns' as const,
          description: album.description,
          date: '',
          count: published.length,
          cover,
          photos: published,
        }
      })
      .filter(album => album.photos.length > 0)

    return { photos, albums, featuredPhotoIds:(data.featuredPhotoIds||[]).map(String), isPreview: true }
  }
  // Apenas o catálogo explicitamente ilustrativo, nunca recursos internos da Landing.
  const demoAlbums = demonstrationAlbums.map(album => ({
    ...album,
    photos: album.photos.filter(photo => photo.published === true),
  }))
  const unique = new Map<string, GalleryPhoto>()
  for (const album of demoAlbums) for (const photo of album.photos) unique.set(photo.id, photo)
  return { photos: [...unique.values()], albums: demoAlbums, featuredPhotoIds:[...unique.keys()].slice(0,3), isPreview: false }
})
