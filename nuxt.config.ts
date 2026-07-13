const themeScript = `(function(){try{var s=localStorage.getItem('va-theme');var t=s==='system'||s==='phosphor'?s:(matchMedia('(prefers-color-scheme: dark)').matches?'phosphor':'system');document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t==='phosphor'?'dark':'light'}catch(e){document.documentElement.dataset.theme='system'}})()`

export default defineNuxtConfig({
  modules: [
    '@nuxtjs/i18n',
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

  routeRules: {
    '/': { redirect: '/ru/' },
    '/ru/**': { prerender: true },
    '/en/**': { prerender: true },
  },

  compatibilityDate: '2026-07-12',

  nitro: {
    prerender: {
      crawlLinks: true,
      failOnError: true,
      routes: [
        '/ru/',
        '/en/',
        '/ru/projects/powersketch/',
        '/en/projects/powersketch/',
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

  i18n: {
    baseUrl: 'https://alekhin.dev',
    defaultLocale: 'ru',
    strategy: 'prefix',
    detectBrowserLanguage: false,
    locales: [
      {
        code: 'ru',
        language: 'ru-RU',
        name: 'Русский',
        file: 'ru.json',
      },
      {
        code: 'en',
        language: 'en-US',
        name: 'English',
        file: 'en.json',
      },
    ],
  },
})
