import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import App from '@/App'

describe('site structure', () => {
  it('renders the overview gallery and primary nav', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Shivendra')
    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Overview' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Work' })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Contact' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Previous Experience: Sennder' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Passion: The stage' })).toBeInTheDocument()
    expect(document.querySelector('canvas')).toBeNull()

    fireEvent.click(screen.getByRole('button', { name: 'Previous Experience: Sennder' }))
    expect(screen.getByRole('dialog')).toHaveTextContent('Sennder')
  })
})
