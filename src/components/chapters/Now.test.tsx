import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Now from '@/components/chapters/Now'
import { currentFocus, workLog } from '@/content/load'

describe('Now chapter', () => {
  it('renders the current work-log entry and metrics', () => {
    const current = currentFocus()
    const shipped = workLog.filter((entry) => entry.status === 'shipped')
    render(<Now current={current} shipped={shipped} />)

    expect(screen.getByTestId('current-focus')).toHaveTextContent(current.title)
    expect(screen.getByText(current.summary)).toBeInTheDocument()
    for (const metric of current.metrics) {
      expect(screen.getByText(metric.name)).toBeInTheDocument()
      expect(screen.getByText(`-${metric.delta_pct}%`)).toBeInTheDocument()
    }
  })
})
