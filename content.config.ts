import { defineCollection, defineContentConfig, z } from '@nuxt/content'

const requiredText = z.string().min(1)
const optionalText = z.string().nullable().optional()
const requiredUrl = z.string().url()
const optionalUrl = z.union([z.string().url(), z.literal('')]).nullable().optional()
const optionalEmail = z.union([z.string().email(), z.literal('')]).nullable().optional()
const labeledItem = z.object({ item: requiredText })
const technology = z.object({ label: requiredText })

const portfolioSchema = z.object({
  locale: z.enum(['en', 'ru']),
  seo: z.object({
    title: requiredText,
    description: requiredText,
    ogTitle: requiredText,
    ogDescription: requiredText,
    ogImage: requiredUrl,
    canonicalUrl: requiredUrl,
    ogLocale: requiredText,
    ogAlternateLocale: requiredText,
  }),
  site: z.object({
    name: requiredText,
    schemaName: requiredText,
    shortName: requiredText,
    role: requiredText,
    schemaRole: requiredText,
    knowsAbout: z.array(requiredText).min(1),
    domain: requiredText,
    url: requiredUrl,
  }),
  navigation: z.object({
    items: z.array(z.object({
      id: requiredText,
      label: requiredText,
    })).min(1),
    contactLabel: requiredText,
    menuOpenLabel: requiredText,
    menuCloseLabel: requiredText,
    menuTitle: requiredText,
    themeLabel: requiredText,
    languageLabel: requiredText,
    skipLabel: requiredText,
  }),
  hero: z.object({
    eyebrow: requiredText,
    title: requiredText,
    description: requiredText,
    experience: requiredText,
    availability: requiredText,
    primaryAction: z.object({
      label: requiredText,
      href: requiredText,
    }),
    secondaryAction: z.object({
      label: requiredText,
      href: requiredText,
    }),
    technologiesLabel: requiredText,
    technologies: z.array(technology).min(1),
    portrait: z.union([
      z.object({
        src: requiredText,
        alt: requiredText,
      }),
      z.object({
        src: z.union([z.literal(''), z.null()]).optional(),
        alt: optionalText,
      }),
    ]).optional(),
    visual: z.object({
      monogram: requiredText,
      label: requiredText,
      cards: z.array(z.object({
        title: requiredText,
        description: requiredText,
      })).min(1),
    }),
  }),
  services: z.object({
    eyebrow: requiredText,
    title: requiredText,
    description: requiredText,
    items: z.array(z.object({
      id: requiredText,
      title: requiredText,
      description: requiredText,
      icon: optionalText,
      details: z.array(labeledItem).optional(),
    })).min(1),
  }),
  projects: z.object({
    eyebrow: requiredText,
    title: requiredText,
    description: requiredText,
    emptyLabel: requiredText,
    labels: z.object({
      featured: requiredText,
      role: requiredText,
      responsibilities: requiredText,
      features: requiredText,
      technologies: requiredText,
      result: requiredText,
      visit: requiredText,
      repository: requiredText,
    }),
    items: z.array(z.object({
      id: requiredText,
      published: z.boolean(),
      featured: z.boolean(),
      title: requiredText,
      shortDescription: requiredText,
      fullDescription: requiredText,
      url: optionalUrl,
      repositoryUrl: optionalUrl,
      images: z.array(z.object({
        src: requiredText,
        alt: requiredText,
      })).optional(),
      role: z.array(labeledItem).optional(),
      responsibilities: z.array(labeledItem).optional(),
      features: z.array(labeledItem).optional(),
      technologies: z.array(technology).optional(),
      result: requiredText,
      metrics: z.array(z.object({
        value: requiredText,
        label: requiredText,
      })).optional(),
    })),
  }),
  process: z.object({
    eyebrow: requiredText,
    title: requiredText,
    description: requiredText,
    items: z.array(z.object({
      number: requiredText,
      title: requiredText,
      description: requiredText,
      details: z.array(labeledItem).optional(),
    })).min(1),
  }),
  about: z.object({
    eyebrow: requiredText,
    title: requiredText,
    paragraphs: z.array(z.object({ text: requiredText })).min(1),
    facts: z.array(z.object({
      value: requiredText,
      label: requiredText,
    })).min(1),
  }),
  availability: z.object({
    visible: z.boolean(),
    available: z.boolean(),
    label: requiredText,
    title: requiredText,
    description: requiredText,
    location: optionalText,
    timezone: optionalText,
    locationLabel: requiredText,
    timezoneLabel: requiredText,
  }),
  contacts: z.object({
    eyebrow: requiredText,
    title: requiredText,
    description: requiredText,
    telegram: z.object({
      label: requiredText,
      url: optionalUrl,
    }),
    email: z.object({
      label: requiredText,
      value: optionalEmail,
    }),
    placeholder: requiredText,
    responseNote: requiredText,
  }),
  footer: z.object({
    role: requiredText,
    copyright: requiredText,
    backToTopLabel: requiredText,
  }),
})

export default defineContentConfig({
  collections: {
    portfolio: defineCollection({
      type: 'data',
      source: 'portfolio/*.yml',
      schema: portfolioSchema,
    }),
  },
})
