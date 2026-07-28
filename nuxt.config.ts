import { profile } from './app/data/profile'
import { localeLanguageTag, LocaleCode } from './app/types/i18n'

const projectSlugs = ['powersketch', 'planes-arch', 'nordhus', 'aerovista', 'kineo', 'forma'] as const

const themeScript = `(function(){try{var s=localStorage.getItem('va-theme');var t=s==='system'||s==='phosphor'?s:(matchMedia('(prefers-color-scheme: dark)').matches?'phosphor':'system');document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t==='phosphor'?'dark':'light'}catch(e){document.documentElement.dataset.theme='system'}})()`

export default defineNuxtConfig({
  modules: [
    '@nuxtjs/i18n',
    '@nuxt/fonts',
    '@nuxtjs/seo',
    '@nuxt/image',
    '@nuxt/eslint',
  ],

  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],

  devtools: { enabled: false },

  app: {
    head: {
      titleTemplate: '%s · alekhin.dev',
      meta: [
        { name: 'color-scheme', content: 'light dark' },
        { name: 'theme-color', content: '#edeae4', media: '(prefers-color-scheme: light)' },
        { name: 'theme-color', content: '#090b09', media: '(prefers-color-scheme: dark)' },
      ],
      link: [
        { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
        { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
        { rel: 'manifest', href: '/site.webmanifest' },
      ],
      script: [
        {
          key: 'theme-init',
          innerHTML: themeScript,
          tagPosition: 'head',
        },
      ],
    },
    pageTransition: {
      name: 'system-page',
      mode: 'out-in',
    },
  },

  css: ['~/assets/styles/main.scss'],

  site: {
    url: `https://${profile.domain}`,
    name: profile.domain,
    trailingSlash: true,
  },

  routeRules: {
    '/**': { prerender: true },
    '/card/**': { robots: false },
    [`/${LocaleCode.En}/**`]: { prerender: true },
    [`/${LocaleCode.En}/card/**`]: { robots: false },
  },

  experimental: {
    defaults: {
      nuxtLink: {
        trailingSlash: 'append',
      },
    },
  },

  compatibilityDate: '2026-07-12',

  nitro: {
    prerender: {
      crawlLinks: true,
      failOnError: true,
      ignore: [`/${LocaleCode.En}/sitemap.xml`],
      routes: [
        '/',
        `/${LocaleCode.En}/`,
        '/card/',
        `/${LocaleCode.En}/card/`,
        ...projectSlugs.flatMap(slug => [
          `/projects/${slug}/`,
          `/${LocaleCode.En}/projects/${slug}/`,
        ]),
      ],
    },
  },

  typescript: {
    strict: true,
  },

  eslint: {
    config: {
      stylistic: {
        quotes: 'single',
        semi: false,
        commaDangle: 'always-multiline',
      },
    },
  },

  fonts: {
    families: [
      {
        global: true,
        name: 'JetBrains Mono Cyrillic',
        src: '/fonts/jetbrains-mono-cyrillic-wght-normal.woff2',
        style: 'normal',
        weight: [100, 800],
      },
      {
        global: true,
        name: 'JetBrains Mono Latin',
        src: '/fonts/jetbrains-mono-latin-wght-normal.woff2',
        style: 'normal',
        weight: [100, 800],
      },
    ],
    providers: {
      bunny: false,
      fontshare: false,
      fontsource: false,
      google: false,
    },
  },

  i18n: {
    baseUrl: 'https://alekhin.dev',
    defaultLocale: LocaleCode.Ru,
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      alwaysRedirect: false,
      cookieKey: 'i18n_redirected',
      fallbackLocale: LocaleCode.Ru,
      redirectOn: 'root',
      useCookie: true,
    },
    locales: [
      {
        code: LocaleCode.Ru,
        language: localeLanguageTag[LocaleCode.Ru],
        name: LocaleCode.Ru.toUpperCase(),
        file: `${LocaleCode.Ru}.json`,
      },
      {
        code: LocaleCode.En,
        language: localeLanguageTag[LocaleCode.En],
        name: LocaleCode.En.toUpperCase(),
        file: `${LocaleCode.En}.json`,
      },
    ],
  },

  linkChecker: {
    runOnBuild: true,
    failOnError: true,
  },

  ogImage: {
    defaults: {
      height: 630,
      width: 1200,
    },
    enabled: true,
    zeroRuntime: true,
  },

  robots: {
    allow: '/',
    mergeWithRobotsTxtPath: false,
  },

  schemaOrg: {
    defaults: true,
  },

  sitemap: {
    autoI18n: {
      defaultLocale: LocaleCode.Ru,
      locales: [
        {
          code: LocaleCode.Ru,
          language: localeLanguageTag[LocaleCode.Ru],
          _hreflang: localeLanguageTag[LocaleCode.Ru],
          _sitemap: `${LocaleCode.Ru}-sitemap`,
        },
        {
          code: LocaleCode.En,
          language: localeLanguageTag[LocaleCode.En],
          _hreflang: localeLanguageTag[LocaleCode.En],
          _sitemap: `${LocaleCode.En}-sitemap`,
        },
      ],
      strategy: 'prefix_except_default',
    },
    sitemapsPathPrefix: false,
    zeroRuntime: true,
  },
})
