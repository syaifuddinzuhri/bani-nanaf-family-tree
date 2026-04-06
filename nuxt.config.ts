// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  tailwindcss: {
    exposeConfig: true,
    viewer: true,
  },
  runtimeConfig: {
    public: {
      firebase: {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID
      }
    }
  },
  app: {
    head: {
      title: 'Bani Nanaf | Silsilah Keluarga Digital',
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
      meta: [
        { name: 'description', content: 'Arsip Digital Silsilah Keluarga Besar Bani Nanaf (Mbah Naimin & Nafsiah).' },
        { name: 'keywords', content: 'silsilah keluarga, bani nanaf, mbah naimin, nafsiah, nasab keluarga, family tree digital, silsilah bani' },
        { name: 'theme-color', content: '#10b981' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
      ],
    }
  },
})
