import { NavLink } from 'react-router-dom'
import { profile } from '@/content/load'

const links = [
  { to: '/', label: 'Overview' },
  { to: '/about', label: 'About' },
]

export default function Nav() {
  return (
    <header className="pointer-events-none fixed top-0 right-0 left-0 z-[60]">
      <div className="relative flex items-center px-6 py-6 sm:px-10">
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
        <p className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-[13px] font-semibold tracking-[0.18em] uppercase sm:text-[15px] sm:tracking-[0.22em]">
          <span className="sm:hidden">{profile.firstName}</span>
          <span className="hidden sm:inline">{profile.name}</span>
        </p>
      </div>
    </header>
  )
}
