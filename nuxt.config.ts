import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt'],
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()]
  },
  runtimeConfig: {
    resendApiKey: '',
    public: {
      appUrl: process.env.NUXT_PUBLIC_APP_URL || 'http://localhost:3000',
      calendlyUrl:
        process.env.NUXT_PUBLIC_CALENDLY_URL || 'https://cal.com/antoine-gowie/meeting'
    }
  },
  app: {
    head: {
      title: 'Outil de validation SaaS gratuit | Orange Bleu',
      htmlAttrs: {
        lang: 'fr'
      },
      meta: [
        {
          name: 'description',
          content:
            "Verifie si ton idee de SaaS merite d'etre developpee. 7 checkpoints en 15 minutes."
        },
        {
          property: 'og:title',
          content: 'Outil de validation SaaS gratuit | Orange Bleu'
        },
        {
          property: 'og:description',
          content:
            "Verifie si ton idee de SaaS merite d'etre developpee. 7 checkpoints en 15 minutes."
        },
        {
          property: 'og:type',
          content: 'website'
        },
        {
          property: 'og:image',
          content: '/og-image.svg'
        }
      ]
    }
  }
})
