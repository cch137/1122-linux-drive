import { appName, author } from './constants/app';

const description = `A free GPT-4 AI chatbot that can browse the web. This is for everyone.`
const image = 'https://voodex.netlify.app/EVO/EVO-full.png'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      // title: appName,
      noscript: [{
        innerHTML: '<strong>We\'re sorry but this website doesn\'t work properly without JavaScript enabled. Please enable it to continue.</strong>'
      }],
      meta: [
        { charset: 'UTF-8' },
        { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
        { name: 'viewport', content: 'width=device-width,initial-scale=1,user-scalable=no' },
        { name: 'author', content: author },
        { name: 'keywords', content: appName },
        { name: 'description', content: description },
        { property: 'twitter:card', content: 'summary_large_image' },
        { property: 'twitter:description', content: description },
        { property: 'twitter:image', content: image },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: appName },
        { property: 'og:description', content: description },
        { property: 'og:image', content: image }
      ]
    },
    layoutTransition: true,
    pageTransition: true
  },
  devtools: { enabled: false },
  modules: [
    '@element-plus/nuxt',
    // '@nuxtjs/tailwindcss',
  ],
  css: [
    'element-plus/dist/index.css',
    'element-plus/theme-chalk/dark/css-vars.css',
    '~/assets/css/main.scss',
    '~/assets/css/default.css',
  ],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {}
    }
  },
  nitro: {
    plugins: []
  },
  serverHandlers: [
    {
      route: '/api/add-pin',
      handler: '~/server/middleware/add-pin.ts',
      method: 'post'
    },
    {
      route: '/api/check-pin',
      handler: '~/server/middleware/check-pin.ts',
      method: 'post'
    }
  ]
})
