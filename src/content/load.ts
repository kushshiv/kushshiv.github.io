import { parse } from 'yaml'
import {
  siteSchema,
  type Experience,
  type GalleryCard,
  type Goals,
  type Passion,
  type Profile,
  type Project,
  type Skills,
  type WorkLogEntry,
} from './schema'

import siteRaw from '../../content/site.yaml?raw'

const site = siteSchema.parse(parse(siteRaw))

export const profile: Profile = site.profile
export const skills: Skills = site.skills
export const goals: Goals = site.goals

export const workLog: WorkLogEntry[] = [...site.workLog].sort((a, b) => b.date.localeCompare(a.date))

export function currentFocus(entries: WorkLogEntry[] = workLog): WorkLogEntry {
  const current = entries.filter((entry) => entry.status === 'current')
  if (current.length !== 1) {
    throw new Error(`Expected exactly one work-log item with status: current, found ${current.length}`)
  }
  return current[0]
}

function cardMeta(item: (typeof site.gallery)[number]) {
  if (item.role && item.period) return `${item.role} · ${item.period}`
  return item.achievement
}

export const galleryCards: GalleryCard[] = site.gallery.map((item) => ({
  id: item.id,
  title: item.title,
  kicker: item.kicker,
  when: item.when,
  image: item.image,
  summary: item.summary,
  details: item.details,
  stack: item.stack,
  meta: cardMeta(item),
  href: item.demoPath,
  hrefLabel: item.demoPath ? 'Open lab' : undefined,
  github: item.github,
}))

export const projects: Project[] = site.gallery
  .filter((item) => item.kind === 'project')
  .map((item) => ({
    slug: item.slug!,
    name: item.title,
    tagline: item.summary,
    description: item.description!,
    details: item.details,
    stack: item.stack!,
    github: item.github!,
    demoPath: item.demoPath!,
    runLocally: item.runLocally!,
  }))

export const experience: Experience = {
  roles: site.gallery
    .filter((item) => item.kind === 'experience')
    .map((item) => ({
      title: item.role!,
      company: item.company!,
      period: item.period!,
      summary: item.summary,
      details: item.details,
      stack: item.stack!,
    })),
}

const stage = site.gallery.find((item) => item.kind === 'passion')
if (!stage) throw new Error('Gallery is missing a passion card')

export const passion: Passion = {
  title: stage.title,
  headline: stage.headline ?? stage.title,
  summary: stage.summary,
  achievement: stage.achievement ?? '',
  details: stage.details,
  nextGoals: stage.nextGoals ?? [],
}
