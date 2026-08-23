import { profile, skills } from '@/content/load'

export default function About() {
  return (
    <main className="min-h-screen px-6 pt-28 pb-24 sm:px-10">
      <article aria-label="About" className="mx-auto max-w-5xl">
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,240px)_1fr] lg:gap-16">
          <img
            src={profile.photo}
            alt=""
            className="aspect-[4/5] w-full max-w-[240px] object-cover"
          />
          <div>
            <p className="text-[11px] tracking-[0.22em] text-muted uppercase">About</p>
            <h1 className="mt-4 text-4xl tracking-[-0.04em] sm:text-5xl">{profile.name}</h1>
            <p className="mt-3 text-sm text-muted">
              {profile.title} · {profile.location}
            </p>
            <p className="mt-8 max-w-2xl text-[17px] leading-[1.65] text-[#c4c4c0]">{profile.blurb}</p>
            <nav aria-label="Contact links" className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm">
              <a href={profile.linkedin} target="_blank" rel="noreferrer" className="hover:text-muted">
                LinkedIn
              </a>
              <a href={profile.github} target="_blank" rel="noreferrer" className="hover:text-muted">
                GitHub
              </a>
            </nav>
          </div>
        </div>

        <section className="mt-20 border-t border-line pt-10" aria-labelledby="education-heading">
          <h2 id="education-heading" className="text-[11px] tracking-[0.22em] text-muted uppercase">
            Education
          </h2>
          <ul className="mt-8 grid gap-8 sm:grid-cols-2">
            {profile.education.map((entry) => (
              <li key={entry.school}>
                <p className="text-lg tracking-[-0.02em]">{entry.school}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{entry.credential}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-16 border-t border-line pt-10" aria-labelledby="skills-heading">
          <h2 id="skills-heading" className="text-[11px] tracking-[0.22em] text-muted uppercase">
            Skills
          </h2>
          <ul className="mt-8 grid gap-10 sm:grid-cols-2">
            {skills.groups.map((group) => (
              <li key={group.name}>
                <p className="text-[11px] tracking-[0.16em] text-muted uppercase">{group.name}</p>
                <p className="mt-3 text-sm leading-7">{group.items.join(' · ')}</p>
              </li>
            ))}
          </ul>
        </section>
      </article>
    </main>
  )
}
