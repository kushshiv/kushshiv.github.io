import { profile, skills } from '@/content/load'

export default function Contact() {
  return (
    <main className="min-h-screen px-6 pt-28 pb-24 sm:px-10">
      <section aria-label="Contact" className="max-w-2xl">
        <h1 className="text-sm text-muted">Contact</h1>
        <p className="mt-10 text-2xl leading-snug tracking-[-0.03em] sm:text-3xl">{profile.blurb}</p>
        <div className="mt-12 flex flex-wrap gap-8 text-sm">
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href={profile.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
        <ul className="mt-16 space-y-2 text-sm text-muted">
          {skills.groups.map((group) => (
            <li key={group.name}>
              {group.name}: {group.items.join(', ')}
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
