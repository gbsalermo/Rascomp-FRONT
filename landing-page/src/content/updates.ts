import { LANDING_EVENTS, type LandingEvent } from './events'

export type LandingUpdateKind =
  | 'event'
  | 'competition'
  | 'board'
  | 'extension'
  | 'achievement'
  | 'institutional'

export type LandingUpdate = {
  id: string
  tag: string
  title: string
  summary: string
  dateLabel: string
  href: string
  kind: LandingUpdateKind
  sourceEventId?: string
}

function eventById(id: string): LandingEvent {
  const event = LANDING_EVENTS.find((item) => item.id === id)

  if (!event) {
    throw new Error(`Evento não encontrado para novidade: ${id}`)
  }

  return event
}

function fromEvent(
  eventId: string,
  options: {
    tag?: string
    title?: string
    summary?: string
    href?: string
    kind?: LandingUpdateKind
  } = {}
): LandingUpdate {
  const event = eventById(eventId)

  return {
    id: `event-${event.id}`,
    tag: options.tag ?? event.type,
    title: options.title ?? event.title,
    summary: options.summary ?? event.summary,
    dateLabel: event.dateLabel,
    href: options.href ?? '#eventos',
    kind: options.kind ?? 'event',
    sourceEventId: event.id
  }
}

/**
 * Feed manual de "Últimas novidades" da Beta A.
 *
 * A ordem aqui representa a prioridade/recência editorial do feed, não
 * necessariamente a ordem cronológica dos eventos.
 *
 * Eventos podem ser reaproveitados via fromEvent(). Conteúdos que não são
 * eventos (nova chapa, premiação, comunicado, visita institucional etc.)
 * entram diretamente como LandingUpdate.
 */
export const LANDING_UPDATES: LandingUpdate[] = [
  fromEvent('rcx-2026', {
    tag: 'Competição',
    title: 'RCX 2026',
    kind: 'competition'
  }),
  fromEvent('congresso-ufrb-2026', {
    tag: 'Congresso',
    title: 'Apresentação de banners no Congresso UFRB',
    kind: 'event'
  }),
  fromEvent('rrc-2026', {
    tag: 'Competição',
    title: 'RRC 2026',
    kind: 'competition'
  })
]

/**
 * Exemplo para conteúdo sem evento associado:
 *
 * {
 *   id: 'nova-chapa-2027',
 *   tag: 'Institucional',
 *   title: 'Nova chapa da IEEE RAS UFRB',
 *   summary: 'Apresentação da nova diretoria do capítulo.',
 *   dateLabel: 'OUT 2026',
 *   href: '#equipe',
 *   kind: 'board'
 * }
 */
