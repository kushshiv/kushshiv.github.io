import { parse } from 'yaml'
import {
  experienceSchema,
  gallerySchema,
  goalsSchema,
  passionSchema,
  profileSchema,
  projectSchema,
  skillsSchema,
  workLogSchema,
  type Experience,
  type GalleryCard,
  type Goals,
  type Passion,
  type Profile,
  type Project,
  type Skills,
  type WorkLogEntry,
} from './schema'

import profileRaw from '../../content/profile.yaml?raw'
import experienceRaw from '../../content/experience.yaml?raw'
import skillsRaw from '../../content/skills.yaml?raw'
import goalsRaw from '../../content/goals.yaml?raw'
import passionRaw from '../../content/passion/bodybuilding.yaml?raw'
import biteScoreRaw from '../../content/projects/bite-score.yaml?raw'
import dendridbRaw from '../../content/projects/dendridb.yaml?raw'
import galleryRaw from '../../content/gallery.yaml?raw'

const workLogFiles = import.meta.glob('../../content/work-log/*.yaml', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>

export const profile: Profile = profileSchema.parse(parse(profileRaw))
export const experience: Experience = experienceSchema.parse(parse(experienceRaw))
export const skills: Skills = skillsSchema.parse(parse(skillsRaw))
export const goals: Goals = goalsSchema.parse(parse(goalsRaw))
export const passion: Passion = passionSchema.parse(parse(passionRaw))

export const projects: Project[] = [biteScoreRaw, dendridbRaw].map((raw) =>
  projectSchema.parse(parse(raw)),
)

export const workLog: WorkLogEntry[] = Object.entries(workLogFiles)
  .map(([, raw]) => workLogSchema.parse(parse(raw)))
  .sort((a, b) => b.date.localeCompare(a.date))

export function currentFocus(entries: WorkLogEntry[] = workLog): WorkLogEntry {
  const current = entries.filter((entry) => entry.status === 'current')
  if (current.length !== 1) {
    throw new Error(`Expected exactly one work-log item with status: current, found ${current.length}`)
  }
  return current[0]
}

const galleryFile = gallerySchema.parse(parse(galleryRaw))

export const galleryCards: GalleryCard[] = galleryFile.items.map((item) => {
  if (item.kind === 'now') {
    const current = currentFocus()
    return {
      id: item.id,
      title: item.title,
      kicker: item.kicker,
      when: item.when,
      image: item.image,
      summary: current.summary,
      details: current.title,
      meta: current.date,
    }
  }

  if (item.kind === 'experience') {
    const role = experience.roles.find((entry) => entry.company === item.company)
    if (!role) throw new Error(`Gallery card ${item.id} has no matching role: ${item.company}`)
    return {
      id: item.id,
      title: item.title,
      kicker: item.kicker,
      when: item.when,
      image: item.image,
      summary: role.summary,
      details: role.details,
      meta: `${role.title} · ${role.period}`,
    }
  }

  if (item.kind === 'project') {
    const project = projects.find((entry) => entry.slug === item.slug)
    if (!project) throw new Error(`Gallery card ${item.id} has no matching project: ${item.slug}`)
    return {
      id: item.id,
      title: item.title,
      kicker: item.kicker,
      when: item.when,
      image: item.image,
      summary: project.tagline,
      details: project.description,
      meta: project.stack.join(' · '),
      href: project.demoPath,
      hrefLabel: 'Open lab',
      github: project.github,
    }
  }

  return {
    id: item.id,
    title: item.title,
    kicker: item.kicker,
    image: item.image,
    summary: passion.summary,
    details: passion.headline,
    meta: passion.achievement,
  }
})
