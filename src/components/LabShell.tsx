import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { Project } from '@/content/schema'

type Props = {
  project: Project
  disclaimer: string
  children: ReactNode
}

export default function LabShell({ project, disclaimer, children }: Props) {
  return (
    <div className="min-h-screen bg-bg text-fg">
      <header className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-6 py-6">
        <Link className="text-[13px] text-muted hover:text-fg" to="/">
          close
        </Link>
        <a className="text-[13px] text-muted hover:text-fg" href={project.github} target="_blank" rel="noreferrer">
          GitHub
        </a>
      </header>
      <main className="mx-auto max-w-5xl px-6 pb-20">
        <p className="text-sm text-muted">Static lab</p>
        <h1 className="mt-3 text-4xl tracking-[-0.04em] sm:text-6xl">{project.name}</h1>
        <p className="mt-4 max-w-xl text-sm text-muted">{project.tagline}</p>
        <p className="mt-8 max-w-xl border-t border-line pt-6 text-sm text-muted" role="note">
          {disclaimer}
        </p>
        <div className="mt-12">{children}</div>
        <section className="mt-16 border-t border-line pt-8" aria-label="Run locally">
          <h2 className="text-sm">Run the real app locally</h2>
          <pre
            tabIndex={0}
            className="mt-4 overflow-x-auto bg-[#1c1c1c] p-4 text-xs break-all whitespace-pre-wrap text-fg"
          >
            <code>{project.runLocally}</code>
          </pre>
        </section>
      </main>
    </div>
  )
}
