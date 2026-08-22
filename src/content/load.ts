import { parse } from 'yaml'
import { gallerySchema, profileSchema, type GalleryCard, type Profile, type Project, type Skills } from './schema'

import profileRaw from '../../content/profile.yaml?raw'
import galleryRaw from '../../content/gallery.yaml?raw'

const profileFile = profileSchema.parse(parse(profileRaw))
const { skills: skillGroups, ...profileFields } = profileFile

export const profile: Profile = profileFields
export const skills: Skills = skillGroups

const galleryFile = gallerySchema.parse(parse(galleryRaw))

function cardMeta(item: (typeof galleryFile.items)[number]) {
  return [item.role, item.period].filter(Boolean).join(' · ') || undefined
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
  github: item.github,
}))

export const projects: Project[] = galleryFile.items.flatMap((item) => {
  if (!item.slug || !item.github || !item.demoPath || !item.runLocally || !item.stack) return []
  return [
    {
      slug: item.slug,
      name: item.title,
      tagline: item.summary,
      description: item.description ?? item.summary,
      details: item.details,
      stack: item.stack,
      github: item.github,
      demoPath: item.demoPath,
      runLocally: item.runLocally,
    },
  ]
})
