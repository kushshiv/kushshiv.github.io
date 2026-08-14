import { z } from 'zod'

export const educationSchema = z.object({
  school: z.string().min(1),
  credential: z.string().min(1),
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
})

export const roleSchema = z.object({
  title: z.string().min(1),
  company: z.string().min(1),
  period: z.string().min(1),
  summary: z.string().min(1),
  details: z.string().min(1),
  stack: z.array(z.string().min(1)).min(1),
})

export const experienceSchema = z.object({
  roles: z.array(roleSchema).min(1),
})

export const skillGroupSchema = z.object({
  name: z.string().min(1),
  items: z.array(z.string().min(1)).min(1),
})

export const skillsSchema = z.object({
  groups: z.array(skillGroupSchema).min(1),
})

export const metricSchema = z.object({
  name: z.string().min(1),
  from: z.string().min(1),
  to: z.string().min(1),
  delta_pct: z.number(),
  note: z.string().optional(),
})

export const workLogSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  title: z.string().min(1),
  status: z.enum(['current', 'shipped']),
  summary: z.string().min(1),
  metrics: z.array(metricSchema).min(1),
  tags: z.array(z.string().min(1)).min(1),
})

export const projectSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  tagline: z.string().min(1),
  description: z.string().min(1),
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

export const passionSchema = z.object({
  title: z.string().min(1),
  headline: z.string().min(1),
  summary: z.string().min(1),
  achievement: z.string().min(1),
  nextGoals: z.array(z.string().min(1)).min(1),
})

export const goalItemSchema = z.object({
  title: z.string().min(1),
  detail: z.string().min(1),
})

export const goalsSchema = z.object({
  office: z.array(goalItemSchema).min(3).max(4),
  projects: z.array(goalItemSchema).min(3).max(4),
  stage: z.array(goalItemSchema).min(3).max(4),
})

export const galleryItemSchema = z
  .object({
    id: z.string().min(1),
    title: z.string().min(1),
    kicker: z.string().min(1),
    when: z.string().min(1).optional(),
    image: z.string().regex(/^\/.+/, 'image must be a public path starting with /'),
    kind: z.enum(['now', 'experience', 'project', 'passion']),
    company: z.string().min(1).optional(),
    slug: z.string().min(1).optional(),
  })
  .superRefine((item, ctx) => {
    if (item.kind === 'experience' && !item.company) {
      ctx.addIssue({ code: 'custom', message: 'experience cards need company', path: ['company'] })
    }
    if (item.kind === 'project' && !item.slug) {
      ctx.addIssue({ code: 'custom', message: 'project cards need slug', path: ['slug'] })
    }
  })

export const gallerySchema = z.object({
  items: z.array(galleryItemSchema).min(1),
})

export type Profile = z.infer<typeof profileSchema>
export type Experience = z.infer<typeof experienceSchema>
export type Role = z.infer<typeof roleSchema>
export type Skills = z.infer<typeof skillsSchema>
export type WorkLogEntry = z.infer<typeof workLogSchema>
export type Project = z.infer<typeof projectSchema>
export type Passion = z.infer<typeof passionSchema>
export type Goals = z.infer<typeof goalsSchema>
export type Metric = z.infer<typeof metricSchema>
export type GalleryItem = z.infer<typeof galleryItemSchema>
export type GalleryCard = {
  id: string
  title: string
  kicker: string
  when?: string
  image: string
  summary: string
  details?: string
  meta?: string
  href?: string
  hrefLabel?: string
  github?: string
}
