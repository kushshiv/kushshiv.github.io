import { describe, expect, it } from 'vitest'
import { galleryCards, profile, projects } from '@/content/load'
import { projectSchema } from '@/content/schema'

describe('content schemas', () => {
  it('parses profile contact URLs over https', () => {
    expect(profile.linkedin.startsWith('https://')).toBe(true)
    expect(profile.github.startsWith('https://')).toBe(true)
    expect(profile.email).toContain('@')
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
