// Plugin do módulo Nuxt: registra <SvgIcone> no app (o site não precisa criar plugin próprio).
// Função pura (o Nuxt aceita): defineNuxtPlugin não resolve a partir de node_modules.
import SvgIcone from './SvgIcone.js'

export default function edusitesIcons (nuxtApp) {
  nuxtApp.vueApp.component('SvgIcone', SvgIcone)
}
