// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  modules: ['@nuxt/fonts'],

  fonts: {
    families: [
      { name: 'Turret Road', provider: 'google', weights: [400, 500, 700] },
      { name: 'Bitcount Prop Single', provider: 'google' },
    ],
  },
})
