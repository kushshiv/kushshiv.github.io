import { NavLink } from 'react-router-dom'
import { profile } from '@/content/load'

const links = [
  { to: '/', label: 'Overview' },
  { to: '/contact', label: 'Contact' },
]

export default function Nav() {
  return (
    <header className="pointer-events-none fixed top-0 right-0 left-0 z-30">
      <div className="flex items-center justify-between px-6 py-6 sm:px-10">
        <nav aria-label="Primary" className="pointer-events-auto flex items-center gap-6 sm:gap-8">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `text-[13px] tracking-[0.04em] ${isActive ? 'text-fg' : 'text-muted hover:text-fg'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <p className="pointer-events-none hidden text-[11px] tracking-[0.28em] uppercase sm:block">
          {profile.name}
        </p>
      </div>
    </header>
  )
}
