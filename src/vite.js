// Plugin Vite: no BUILD, o bundle só leva os ícones que o projeto usa.
//
// Sem ele, o `import.meta.glob('./icones/*.js')` do resolvedor vira um arquivo por ícone da lib
// (1.600+ chunks no build, mesmo usando 10) e o monolítico de 2,4 MB também é emitido. Com ele:
//
// 1. Varre o código do projeto (vue, js, ts, json, md...) atrás de textos entre aspas que sejam nomes
//    de ícone ("whatsapp", 'seta-direita', `check`) e troca o glob por um mapa só com esses.
//    Pega `nome="casa"` no template e também listas de dados (`{ icone: 'casa' }`).
// 2. No bundle do NAVEGADOR, troca o import do monolítico por um objeto vazio: o cliente resolve pelo
//    HTML do SSR e pelos chunks individuais, nunca pelos 2,4 MB.
//
// Nome montado em tempo de execução (`ef-${tipo}`) não aparece no código: passe em `incluir`.
// No `dev` nada muda (o glob completo continua, sem varredura a cada arquivo salvo).
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, extname, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const PASTA_ICONES = fileURLToPath(new URL('./icones/', import.meta.url))
const GLOB_ORIGINAL = "import.meta.glob('./icones/*.js')"
const MONOLITICO_ORIGINAL = "import('./icones.js')"

const EXTENSOES = new Set(['.vue', '.js', '.mjs', '.cjs', '.ts', '.mts', '.cts', '.jsx', '.tsx', '.json', '.md', '.mdx', '.html', '.svelte'])
const PASTAS_FORA = new Set(['node_modules', '.nuxt', '.output', '.data', '.git', 'dist', '.cache', '.vercel', '.netlify', 'coverage'])
const LIMITE_ARQUIVO = 2 * 1024 * 1024
const TEXTO_ENTRE_ASPAS = /["'`]([a-z0-9]+(?:-[a-z0-9]+)*)["'`]/g

function nomesDaLib() {
  return new Set(readdirSync(PASTA_ICONES).filter((arquivo) => arquivo.endsWith('.js')).map((arquivo) => arquivo.slice(0, -3)))
}

// Arquivos de código do projeto (sem dependências, builds e pastas ocultas)
function arquivosDoProjeto(raiz) {
  const lista = []
  const visitar = (pasta) => {
    let entradas
    try {
      entradas = readdirSync(pasta, { withFileTypes: true })
    } catch {
      return
    }
    for (const entrada of entradas) {
      if (entrada.isSymbolicLink()) continue
      const caminho = join(pasta, entrada.name)
      if (entrada.isDirectory()) {
        if (!PASTAS_FORA.has(entrada.name) && !entrada.name.startsWith('.')) visitar(caminho)
      } else if (EXTENSOES.has(extname(entrada.name))) {
        lista.push(caminho)
      }
    }
  }
  visitar(raiz)
  return lista
}

// Nomes de ícone usados no projeto: textos entre aspas que existem na lib, mais os de `incluir`
export function iconesUsados(raiz, { incluir = [] } = {}) {
  const existentes = nomesDaLib()
  const usados = new Set()
  for (const nome of incluir) if (existentes.has(nome)) usados.add(nome)
  for (const arquivo of arquivosDoProjeto(raiz)) {
    let texto
    try {
      if (statSync(arquivo).size > LIMITE_ARQUIVO) continue
      texto = readFileSync(arquivo, 'utf8')
    } catch {
      continue
    }
    for (const achado of texto.matchAll(TEXTO_ENTRE_ASPAS)) {
      if (existentes.has(achado[1])) usados.add(achado[1])
    }
  }
  return [...usados].sort()
}

function mapaDoGlob(nomes) {
  const linhas = nomes.map((nome) => `${JSON.stringify(`./icones/${nome}.js`)}: () => import(${JSON.stringify(`./icones/${nome}.js`)})`)
  return `({${linhas.join(',')}})`
}

const ehResolvedorDaLib = (id) => {
  const limpo = id.split('?')[0].split(sep).join('/')
  return limpo.endsWith('/src/resolvedor.js') && (limpo.includes('@edusites/icons/') || limpo.includes('edusites-icons/'))
}

export function edusitesIconsVite(opcoes = {}) {
  let raiz = opcoes.raiz || null
  let usados = null

  return {
    name: 'edusites-icons',
    apply: 'build',
    // Antes do vite:import-glob, que transformaria o glob completo
    enforce: 'pre',
    configResolved(config) {
      raiz = raiz || config.root
    },
    buildStart() {
      usados = iconesUsados(raiz, { incluir: opcoes.incluir || [] })
    },
    transform(codigo, id, transformacao) {
      if (!ehResolvedorDaLib(id) || !codigo.includes(GLOB_ORIGINAL)) return null
      usados = usados || iconesUsados(raiz, { incluir: opcoes.incluir || [] })
      let resultado = codigo.replace(GLOB_ORIGINAL, mapaDoGlob(usados))
      // Bundle do navegador: sem o monolítico (o servidor continua com ele para o SSR síncrono)
      if (!transformacao?.ssr) resultado = resultado.replace(MONOLITICO_ORIGINAL, 'Promise.resolve({ ICONES: {} })')
      return { code: resultado, map: null }
    }
  }
}

export default edusitesIconsVite
