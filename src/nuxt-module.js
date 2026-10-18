// Módulo Nuxt: uma linha no nuxt.config e pronto.
//
//   export default defineNuxtConfig({ modules: ['@edusites/icons/nuxt-module'] })
//
// - Registra <SvgIcone> no app inteiro (sem plugin próprio).
// - No build, o bundle só leva os ícones que o site usa (plugin `@edusites/icons/vite`): sem os
//   1.600+ chunks da lib inteira e sem o monolítico no navegador.
//
// Opções (`edusitesIcons` no nuxt.config, ou inline: ['@edusites/icons/nuxt-module', { incluir: [...] }]):
//   incluir: nomes montados em tempo de execução que não aparecem no código (ex.: ['ef-agua', 'ef-sol']).
import { fileURLToPath } from 'node:url'
import { edusitesIconsVite } from './vite.js'

export default function edusitesIconsModule (opcoesInline = {}, nuxt) {
  const opcoes = { ...(nuxt.options.edusitesIcons || {}), ...(opcoesInline || {}) }
  nuxt.options.plugins.push(fileURLToPath(new URL('./runtime-plugin.js', import.meta.url)))
  nuxt.hook('vite:extendConfig', (config) => {
    config.plugins = config.plugins || []
    config.plugins.push(edusitesIconsVite({ raiz: nuxt.options.rootDir, incluir: opcoes.incluir || [] }))
  })
}

edusitesIconsModule.meta = { name: '@edusites/icons', configKey: 'edusitesIcons' }
