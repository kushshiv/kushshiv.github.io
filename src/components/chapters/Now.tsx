import type { WorkLogEntry } from '@/content/schema'

export default function Now({ current, shipped }: { current: WorkLogEntry; shipped: WorkLogEntry[] }) {
  return (
    <div>
      <h2 className="text-sm text-muted">Now</h2>
      <article className="mt-8 border-t border-line pt-8" data-testid="current-focus">
        <p className="text-sm text-muted">{current.date}</p>
        <h3 className="mt-2 text-2xl tracking-[-0.03em]">{current.title}</h3>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">{current.summary}</p>
        <ul className="mt-8 grid gap-8 sm:grid-cols-2" aria-label="Impact metrics">
          {current.metrics.map((metric) => (
            <li key={metric.name}>
              <p className="text-sm text-muted">{metric.name}</p>
              <p className="mt-1 text-xl tracking-[-0.03em]">-{metric.delta_pct}%</p>
              <p className="mt-1 text-sm text-muted">
                {metric.from} → {metric.to}
              </p>
              {metric.note ? <p className="mt-1 text-xs text-muted">{metric.note}</p> : null}
            </li>
          ))}
        </ul>
        <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-1" aria-label="Tags">
          {current.tags.map((tag) => (
            <li key={tag} className="text-sm text-muted">
              {tag}
            </li>
          ))}
        </ul>
      </article>
      {shipped.length > 0 ? (
        <div className="mt-16 border-t border-line pt-8">
          <h3 className="text-sm text-muted">Recently shipped</h3>
          <ul className="mt-8 space-y-8">
            {shipped.map((entry) => (
              <li key={entry.date}>
                <p className="text-sm text-muted">{entry.date}</p>
                <p className="mt-1 text-xl tracking-[-0.03em]">{entry.title}</p>
                <p className="mt-2 max-w-xl text-sm text-muted">{entry.summary}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
