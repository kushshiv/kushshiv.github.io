import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { galleryCards, profile } from '@/content/load'
import type { GalleryCard } from '@/content/schema'
import usePrefersReducedMotion from '@/hooks/usePrefersReducedMotion'

const SPACING = 350
const SLIDE = 140
/** Stand the card so its face is perpendicular to the center-line. */
const CARD_PATH_X = -90

/**
 * Line through card centers. On load the first card sits at the screen center.
 * Change only these two:
 * - LINE_SCREEN: diagonal on the monitor. 0 = horizontal, 45 = top-right ↔ bottom-left
 * - LINE_DEPTH: pitch into the screen. 0 = flat, 45 = more from above
 */
const LINE_SCREEN = 35
const LINE_DEPTH = 70

function layout(index: number, origin: number, hovered: boolean) {
  const t = index - origin
  return {
    x: hovered ? SLIDE : 0,
    y: t * -SPACING,
    z: 0,
    brightness: hovered ? 1 : Math.max(0.62, 1 - Math.abs(t) * 0.08),
  }
}

export default function Gallery() {
  const reduced = usePrefersReducedMotion()
  const [origin, setOrigin] = useState(0)
  const [hovered, setHovered] = useState<string | null>(null)
  const [opened, setOpened] = useState<GalleryCard | null>(null)
  const worldRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([])
  const drag = useRef({ active: false, lastY: 0, moved: false })
  const firstLayout = useRef(true)

  const maxOrigin = Math.max(0, galleryCards.length - 1)

  useLayoutEffect(() => {
    if (!worldRef.current) return
    gsap.set(worldRef.current, { clearProps: 'transform,rotateX,rotateY,rotateZ,yPercent' })
  }, [reduced])

  useLayoutEffect(() => {
    if (reduced) return
    const instant = firstLayout.current
    firstLayout.current = false
    cardRefs.current.forEach((node, index) => {
      if (!node) return
      const next = layout(index, origin, hovered === galleryCards[index].id)
      node.style.zIndex = hovered === galleryCards[index].id ? '20' : String(galleryCards.length - index)
      const vars = {
        xPercent: -50,
        yPercent: -50,
        x: next.x,
        y: next.y,
        z: next.z,
        rotateX: CARD_PATH_X,
        transformOrigin: '50% 50%',
        filter: `brightness(${next.brightness})`,
        force3D: true,
        overwrite: 'auto' as const,
      }
      if (instant) gsap.set(node, vars)
      else gsap.to(node, { ...vars, duration: 0.65, ease: 'power3.out' })
    })
  }, [origin, hovered, reduced])

  useEffect(() => {
    if (reduced || opened) return
    const stage = worldRef.current?.parentElement
    const world = worldRef.current
    if (!stage || !world) return

    const onWheel = (event: WheelEvent) => {
      event.preventDefault()
      setOrigin((value) => Math.min(maxOrigin, Math.max(0, value + event.deltaY / 420)))
    }

    const onPointerDown = (event: PointerEvent) => {
      drag.current = { active: true, lastY: event.clientY, moved: false }
    }

    const onPointerMove = (event: PointerEvent) => {
      if (!drag.current.active) return
      const dy = event.clientY - drag.current.lastY
      if (Math.abs(dy) > 8) drag.current.moved = true
      drag.current.lastY = event.clientY
      setOrigin((value) => Math.min(maxOrigin, Math.max(0, value - dy / 220)))
    }

    const onPointerUp = () => {
      drag.current.active = false
      if (drag.current.moved) setOrigin((value) => Math.round(value))
    }

    stage.addEventListener('wheel', onWheel, { passive: false })
    world.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    return () => {
      stage.removeEventListener('wheel', onWheel)
      world.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
    }
  }, [maxOrigin, opened, reduced])

  useEffect(() => {
    if (!opened) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpened(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [opened])

  const openCard = (card: GalleryCard, index: number) => {
    if (drag.current.moved) return
    setHovered(null)
    setOpened(card)
    setOrigin(index)
  }

  if (reduced) {
    return (
      <div className="mx-auto grid max-w-5xl gap-6 px-6 pt-28 pb-16 sm:grid-cols-2">
        {galleryCards.map((card) => (
          <CardFace key={card.id} card={card} onOpen={() => setOpened(card)} flat />
        ))}
        {opened ? <OpenedCard card={opened} onClose={() => setOpened(null)} /> : null}
      </div>
    )
  }

  return (
    <div className="gallery-stage" role="region" aria-label="Project cards">
      <a
        href={`mailto:${profile.email}`}
        className="absolute bottom-6 left-6 z-10 text-[13px] text-muted hover:text-fg"
        onPointerDown={(event) => event.stopPropagation()}
      >
        {profile.email}
      </a>
      <div
        ref={worldRef}
        className="gallery-world"
        style={{
          ['--line-screen' as string]: `${LINE_SCREEN}deg`,
          ['--line-depth' as string]: `${LINE_DEPTH}deg`,
        }}
      >
        {galleryCards.map((card, index) => (
          <CardFace
            key={card.id}
            card={card}
            onOpen={() => openCard(card, index)}
            onEnter={() => {
              if (!opened) setHovered(card.id)
            }}
            onLeave={() => setHovered((current) => (current === card.id ? null : current))}
            cardRef={(node) => {
              cardRefs.current[index] = node
            }}
            dim={opened !== null}
          />
        ))}
      </div>
      {opened ? <OpenedCard card={opened} onClose={() => setOpened(null)} /> : null}
    </div>
  )
}

function CardFace({
  card,
  onOpen,
  onEnter,
  onLeave,
  cardRef,
  flat,
  dim,
}: {
  card: GalleryCard
  onOpen: () => void
  onEnter?: () => void
  onLeave?: () => void
  cardRef?: (node: HTMLButtonElement | null) => void
  flat?: boolean
  dim?: boolean
}) {
  return (
    <button
      ref={cardRef}
      type="button"
      className={flat ? 'gallery-card gallery-card-flat' : 'gallery-card'}
      style={flat ? undefined : { opacity: dim ? 0.28 : 1 }}
      onClick={onOpen}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      aria-label={`${card.kicker}: ${card.title}`}
    >
      <span className="gallery-card-face">
        <img src={card.image} alt="" className="h-full w-full object-cover" draggable={false} />
      </span>
    </button>
  )
}

function OpenedCard({ card, onClose }: { card: GalleryCard; onClose: () => void }) {
  const internal = card.href?.startsWith('/')

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`card-title-${card.id}`}
      onClick={onClose}
    >
      <article
        className="max-h-[90dvh] w-full max-w-3xl overflow-auto bg-[#141414]"
        onClick={(event) => event.stopPropagation()}
      >
        <img src={card.image} alt="" className="aspect-[16/10] w-full object-cover" />
        <div className="px-6 py-6 sm:px-8">
          <p className="text-[11px] tracking-[0.18em] text-muted uppercase">{card.kicker}</p>
          <h2 id={`card-title-${card.id}`} className="mt-2 text-4xl tracking-[-0.04em]">
            {card.title}
          </h2>
          {card.meta ? <p className="mt-2 text-sm text-muted">{card.meta}</p> : null}
          {card.details ? <p className="mt-6 text-lg tracking-[-0.02em]">{card.details}</p> : null}
          <p className="mt-4 text-sm leading-relaxed text-muted">{card.summary}</p>
          <div className="mt-8 flex flex-wrap gap-6 text-sm">
            {card.href && internal ? (
              <Link to={card.href} className="hover:text-muted">
                {card.hrefLabel ?? 'Open'}
              </Link>
            ) : null}
            {card.href && !internal ? (
              <a href={card.href} className="hover:text-muted">
                {card.hrefLabel ?? 'Open'}
              </a>
            ) : null}
            {card.github ? (
              <a href={card.github} target="_blank" rel="noreferrer" className="hover:text-muted">
                GitHub
              </a>
            ) : null}
            <button type="button" onClick={onClose} className="text-muted hover:text-fg">
              Close
            </button>
          </div>
        </div>
      </article>
    </div>
  )
}
