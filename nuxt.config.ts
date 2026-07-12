export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    '@nuxt/content',
    '@nuxtjs/i18n',
    '@vueuse/nuxt',
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
      meta: [
        { name: 'color-scheme', content: 'light dark' },
        { name: 'theme-color', content: '#f4f3ef', media: '(prefers-color-scheme: light)' },
        { name: 'theme-color', content: '#15171b', media: '(prefers-color-scheme: dark)' },
      ],
      link: [
        { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
        { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
        { rel: 'manifest', href: '/site.webmanifest' },
      ],
    },
  },

  css: ['~/assets/css/main.css'],

  colorMode: {
    preference: 'light',
    fallback: 'light',
    classSuffix: '',
  },

  ui: {
    fonts: false,
    colorMode: true,
    experimental: {
      componentDetection: true,
    },
  },

  routeRules: {
    '/': { prerender: true },
    '/ru': { prerender: true },
  },
  compatibilityDate: '2026-07-12',

  nitro: {
    prerender: {
      crawlLinks: true,
      failOnError: true,
      routes: ['/', '/ru'],
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

  i18n: {
    baseUrl: 'https://alekhin.dev',
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
      fallbackLocale: 'en',
    },
    locales: [
      {
        code: 'en',
        language: 'en-US',
        name: 'English',
      },
      {
        code: 'ru',
        language: 'ru-RU',
        name: 'Русский',
      },
    ],
  },

  icon: {
    provider: 'none',
    fallbackToApi: false,
    clientBundle: {
      icons: [
        'lucide:arrow-up-right',
        'lucide:check',
        'lucide:chevron-down',
        'lucide:loader-circle',
        'lucide:monitor',
        'lucide:moon',
        'lucide:sun',
        'lucide:x',
      ],
    },
  },
})
