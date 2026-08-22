import { parse } from 'yaml'
import {
  gallerySchema,
  profileSchema,
  type Experience,
  type GalleryCard,
  type Profile,
  type Project,
  type Skills,
} from './schema'

import profileRaw from '../../content/profile.yaml?raw'
import galleryRaw from '../../content/gallery.yaml?raw'

const profileFile = profileSchema.parse(parse(profileRaw))
const { skills: skillGroups, ...profileFields } = profileFile

export const profile: Profile = profileFields
export const skills: Skills = skillGroups

const galleryFile = gallerySchema.parse(parse(galleryRaw))

function flatDetails(details: (typeof galleryFile.items)[number]['details']) {
  return details.flatMap((item) => (typeof item === 'string' ? [item] : [item.title, ...item.items]))
}

function cardMeta(item: (typeof galleryFile.items)[number]) {
  if (item.role && item.period) return `${item.role} · ${item.period}`
  return item.achievement
}

export const galleryCards: GalleryCard[] = galleryFile.items.map((item) => ({
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

export const projects: Project[] = galleryFile.items
  .filter((item) => item.kind === 'project')
  .map((item) => ({
    slug: item.slug!,
    name: item.title,
    tagline: item.summary,
    description: item.description!,
    details: flatDetails(item.details),
    stack: item.stack!,
    github: item.github!,
    demoPath: item.demoPath!,
    runLocally: item.runLocally!,
  }))

export const experience: Experience = {
  roles: galleryFile.items
    .filter((item) => item.kind === 'experience')
    .map((item) => ({
      title: item.role!,
      company: item.company!,
      period: item.period!,
      summary: item.summary,
      details: flatDetails(item.details),
      stack: item.stack!,
    })),
}
