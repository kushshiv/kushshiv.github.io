import { useMemo, useState } from 'react'
import LabShell from '@/components/LabShell'
import { projects } from '@/content/load'
import labData from '../../content/labs/dendridb.json'

type Trace = {
  cue: string
  working: string
  episodic: string
  semantic: string
  nodes: string[]
}

function resolveTrace(input: string): Trace {
  const needle = input.trim().toLowerCase()
  if (!needle) {
    return { ...labData.fallback, cue: 'idle' }
  }
  const hit = labData.cues.find(
    (item) =>
      item.cue === needle || item.matches.some((match) => needle.includes(match) || match.includes(needle)),
  )
  if (!hit) return labData.fallback
  return hit
}

export default function DendriDBLab() {
  const project = projects.find((item) => item.slug === 'dendridb')
  if (!project) throw new Error('DendriDB project content missing')

  const [cue, setCue] = useState('on-call')
  const trace = useMemo(() => resolveTrace(cue), [cue])

  return (
    <LabShell project={project} disclaimer={labData.disclaimer}>
      <form className="border-t border-line pt-8" onSubmit={(event) => event.preventDefault()}>
        <label htmlFor="cue" className="text-sm text-muted">
          Recall cue
        </label>
        <div className="mt-3 flex flex-wrap gap-3">
          <input
            id="cue"
            value={cue}
            onChange={(event) => setCue(event.target.value)}
            className="min-w-56 flex-1 border border-line bg-bg px-4 py-2 text-fg"
            placeholder="on-call, bite-score, memory"
          />
          <p className="self-center text-xs text-muted">Try on-call, bite-score, or memory</p>
        </div>
      </form>
      <div className="mt-12 grid gap-10 md:grid-cols-3">
        <article className="border-t border-line pt-5">
          <h2 className="text-[11px] tracking-[0.2em] text-muted uppercase">Working</h2>
          <p className="mt-3 text-sm leading-relaxed">{trace.working}</p>
        </article>
        <article className="border-t border-line pt-5">
          <h2 className="text-[11px] tracking-[0.2em] text-muted uppercase">Episodic</h2>
          <p className="mt-3 text-sm leading-relaxed">{trace.episodic}</p>
        </article>
        <article className="border-t border-line pt-5">
          <h2 className="text-[11px] tracking-[0.2em] text-muted uppercase">Semantic</h2>
          <p className="mt-3 text-sm leading-relaxed">{trace.semantic}</p>
        </article>
      </div>
      <section className="mt-12 border-t border-line pt-8" aria-label="Memory graph">
        <h2 className="text-[11px] tracking-[0.28em] uppercase">Association graph</h2>
        <svg viewBox="0 0 400 180" className="mt-6 h-44 w-full" role="img" aria-label="Canned memory nodes">
          {trace.nodes.map((node, index) => {
            const x = 50 + index * 70
            const y = 70 + (index % 2) * 40
            return (
              <g key={node}>
                {index > 0 ? (
                  <line
                    x1={50 + (index - 1) * 70}
                    y1={70 + ((index - 1) % 2) * 40}
                    x2={x}
                    y2={y}
                    stroke="#8a8a8a"
                    strokeWidth="1"
                    opacity="0.8"
                  />
                ) : null}
                <circle cx={x} cy={y} r="18" fill="#0b0b0b" stroke="#ececec" />
                <text x={x} y={y + 4} textAnchor="middle" fill="#ececec" fontSize="8">
                  {node}
                </text>
              </g>
            )
          })}
        </svg>
      </section>
    </LabShell>
  )
}
