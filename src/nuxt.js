import { defineNuxtPlugin } from '#app'
import SvgIcone from './SvgIcone.js'

// Plugin Nuxt: registra <SvgIcone> globalmente.
// Use no projeto criando plugins/edusites-icons.js com:
//   export { default } from '@edusites/icons/nuxt'
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('SvgIcone', SvgIcone)
})
