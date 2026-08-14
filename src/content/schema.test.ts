import { describe, expect, it } from 'vitest'
import { currentFocus, galleryCards, goals, profile, projects, workLog } from '@/content/load'
import { goalsSchema, projectSchema, workLogSchema } from '@/content/schema'

describe('content schemas', () => {
  it('parses profile contact URLs over https', () => {
    expect(profile.linkedin.startsWith('https://')).toBe(true)
    expect(profile.github.startsWith('https://')).toBe(true)
    expect(profile.email).toContain('@')
  })

  it('has exactly one current work-log entry', () => {
    const current = workLog.filter((entry) => entry.status === 'current')
    expect(current).toHaveLength(1)
    expect(currentFocus().title).toBe(current[0].title)
  })

  it('requires metrics with numeric deltas on every work-log entry', () => {
    for (const entry of workLog) {
      const parsed = workLogSchema.parse(entry)
      expect(parsed.metrics.length).toBeGreaterThan(0)
      for (const metric of parsed.metrics) {
        expect(typeof metric.delta_pct).toBe('number')
        expect(metric.from.length).toBeGreaterThan(0)
        expect(metric.to.length).toBeGreaterThan(0)
      }
    }
  })

  it('keeps 3-4 goals per pillar', () => {
    const parsed = goalsSchema.parse(goals)
    expect(parsed.office.length).toBeGreaterThanOrEqual(3)
    expect(parsed.office.length).toBeLessThanOrEqual(4)
    expect(parsed.projects.length).toBeGreaterThanOrEqual(3)
    expect(parsed.projects.length).toBeLessThanOrEqual(4)
    expect(parsed.stage.length).toBeGreaterThanOrEqual(3)
    expect(parsed.stage.length).toBeLessThanOrEqual(4)
  })

  it('uses internal lab routes or https demo URLs', () => {
    expect(projects.length).toBeGreaterThan(0)
    for (const project of projects) {
      const parsed = projectSchema.parse(project)
      expect(
        parsed.demoPath.startsWith('/labs/') || parsed.demoPath.startsWith('https://'),
      ).toBe(true)
    }
  })

  it('gallery cards cover office, roles, labs, and the stage', () => {
    const titles = galleryCards.map((card) => card.title)
    expect(titles).toEqual(
      expect.arrayContaining([
        'Aviv Group',
        'Sennder',
        'Adcuratio',
        'Infosys',
        'TCS',
        'BiteScore',
        'DendriDB',
        'The stage',
      ]),
    )
    for (const card of galleryCards) {
      expect(card.image.startsWith('/')).toBe(true)
    }
  })
})
