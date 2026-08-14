import { useMemo, useState } from 'react'
import LabShell from '@/components/LabShell'
import { projects } from '@/content/load'
import labData from '../../content/labs/bite-score.json'

type Place = (typeof labData.places)[number]

export default function BiteScoreLab() {
  const project = projects.find((item) => item.slug === 'bite-score')
  if (!project) throw new Error('BiteScore project content missing')

  const [selectedId, setSelectedId] = useState(labData.places[0].id)
  const selected = useMemo(
    () => labData.places.find((place) => place.id === selectedId) as Place,
    [selectedId],
  )

  return (
    <LabShell project={project} disclaimer={labData.disclaimer}>
      <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <h2 id="berlin-map-heading" className="text-[11px] tracking-[0.28em] uppercase">
            Berlin map
          </h2>
          <div
            className="relative mt-4 h-80 overflow-hidden border border-line bg-[radial-gradient(circle_at_30%_20%,#1a1a1a,transparent_40%),linear-gradient(#111,#0b0b0b)]"
            aria-labelledby="berlin-map-heading"
          >
            {labData.places.map((place) => (
              <button
                key={place.id}
                type="button"
                style={{ left: `${place.x}%`, top: `${place.y}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 border px-2 py-1 text-[11px] ${
                  place.id === selectedId ? 'border-fg bg-fg text-bg' : 'border-line bg-bg text-fg'
                }`}
                onClick={() => setSelectedId(place.id)}
              >
                {place.score}
              </button>
            ))}
          </div>
        </div>
        <article className="border-t border-line pt-6 lg:border-t-0 lg:pt-0" data-testid="place-profile">
          <p className="text-[11px] tracking-[0.2em] text-muted uppercase">{selected.area}</p>
          <h2 className="mt-2 text-3xl tracking-tight">{selected.name}</h2>
          <p className="text-sm text-muted">{selected.cuisine}</p>
          <p className="mt-6 text-6xl tracking-tight">{selected.score}</p>
          <p className="text-[11px] tracking-[0.18em] text-muted uppercase">Trust score</p>
          <ul className="mt-8 space-y-2">
            {Object.entries(selected.breakdown).map(([key, value]) => (
              <li key={key} className="flex items-center justify-between text-sm">
                <span className="capitalize text-muted">{key}</span>
                <span>{value}</span>
              </li>
            ))}
          </ul>
        </article>
      </div>
      <ul className="mt-12 border-t border-line" aria-label="Canned places">
        {labData.places.map((place) => (
          <li key={place.id} className="border-b border-line">
            <button
              type="button"
              className="flex w-full items-baseline justify-between gap-4 py-4 text-left hover:text-muted"
              onClick={() => setSelectedId(place.id)}
            >
              <span>{place.name}</span>
              <span className="text-sm text-muted">
                {place.area} · {place.score}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </LabShell>
  )
}
