// Compartilhado por todas as seções: evita baixar novamente imagens já preparadas.
const prepared = new Map<string, Promise<void>>()
export function preloadImage(src?: string): Promise<void> {
  if (!src) return Promise.resolve()
  const current = prepared.get(src)
  if (current) return current
  const promise = new Promise<void>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve()
    image.onerror = () => reject(new Error('Falha ao carregar imagem'))
    image.src = src
    if (image.complete && image.naturalWidth > 0) resolve()
  })
  prepared.set(src, promise)
  void promise.catch(() => prepared.delete(src))
  return promise
}
export function preloadImages(sources: (string | undefined)[], limit = 8): void {
  for (const src of [...new Set(sources.filter((item): item is string => !!item))].slice(0, limit))
    void preloadImage(src).catch(() => undefined)
}
export async function showPreparedImage(src: string | undefined, show: () => void): Promise<void> {
  if (!src) { show(); return }
  try { await preloadImage(src); show() }
  catch { show() } // Não bloquear navegação se a origem falhar.
}
