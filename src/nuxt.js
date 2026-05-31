import SvgIcone from './SvgIcone.js'

// Registra <SvgIcone> globalmente no app Vue/Nuxt.
//
// No seu projeto crie plugins/edusites-icons.js:
//   import { instalarIcones } from '@edusites/icons/nuxt'
//   export default defineNuxtPlugin((nuxtApp) => instalarIcones(nuxtApp))
//
// (defineNuxtPlugin é auto-importado no SEU projeto — não importamos o alias
// interno do Nuxt aqui porque ele não resolve a partir de node_modules.)
export function instalarIcones(nuxtApp) {
  nuxtApp.vueApp.component('SvgIcone', SvgIcone)
}

export default instalarIcones
