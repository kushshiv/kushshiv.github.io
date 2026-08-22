import { z } from 'zod'

export const educationSchema = z.object({
  school: z.string().min(1),
  credential: z.string().min(1),
})

export const skillGroupSchema = z.object({
  name: z.string().min(1),
  items: z.array(z.string().min(1)).min(1),
})

export const skillsSchema = z.object({
  groups: z.array(skillGroupSchema).min(1),
})

export const profileSchema = z.object({
  name: z.string().min(1),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  title: z.string().min(1),
  location: z.string().min(1),
  company: z.string().min(1),
  blurb: z.string().min(1),
  email: z.string().email(),
  linkedin: z.string().url(),
  github: z.string().url(),
  photo: z.string().min(1),
  education: z.array(educationSchema).min(1),
  skills: skillsSchema,
})

export const detailGroupSchema = z.object({
  title: z.string().min(1).optional(),
  items: z.array(z.string().min(1)).min(1),
})

export const galleryItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  kicker: z.string().min(1),
  when: z.string().min(1).optional(),
  image: z.string().regex(/^\/.+/, 'image must be a public path starting with /'),
  kind: z.enum(['now', 'experience', 'project', 'passion']).optional(),
  company: z.string().min(1).optional(),
  role: z.string().min(1).optional(),
  period: z.string().min(1).optional(),
  summary: z.string().min(1),
  details: z.array(detailGroupSchema).min(1),
  stack: z.array(z.string().min(1)).optional(),
  slug: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  github: z.string().url().optional(),
  demoPath: z
    .string()
    .min(1)
    .refine(
      (value) => value.startsWith('/labs/') || value.startsWith('https://'),
      'demoPath must be an internal /labs/... route or an https URL',
    )
    .optional(),
  runLocally: z.string().min(1).optional(),
})

export const gallerySchema = z.object({
  items: z.array(galleryItemSchema).min(1),
})

export const projectSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  tagline: z.string().min(1),
  description: z.string().min(1),
  details: z.array(detailGroupSchema).min(1),
  stack: z.array(z.string().min(1)).min(1),
  github: z.string().url(),
  demoPath: z
    .string()
    .min(1)
    .refine(
      (value) => value.startsWith('/labs/') || value.startsWith('https://'),
      'demoPath must be an internal /labs/... route or an https URL',
    ),
  runLocally: z.string().min(1),
})

export type ProfileFile = z.infer<typeof profileSchema>
export type Profile = Omit<ProfileFile, 'skills'>
export type Skills = z.infer<typeof skillsSchema>
export type Project = z.infer<typeof projectSchema>
export type GalleryItem = z.infer<typeof galleryItemSchema>
export type DetailItem = z.infer<typeof detailGroupSchema>
export type GalleryCard = {
  id: string
  title: string
  kicker: string
  when?: string
  image: string
  summary: string
  details: DetailItem[]
  stack?: string[]
  meta?: string
  href?: string
  github?: string
}
