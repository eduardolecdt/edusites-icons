import { ICONES } from './icones.js'
import { META, CATEGORIAS } from './meta.js'

const PADRAO = {
  cor: '#000000',
  tamanho: 24
}

// Cache de SVGs já montados — evita reprocessar o mesmo ícone/cor/tamanho
const CACHE = new Map()

function normalizarNome(nome) {
  return String(nome || '').toLowerCase().trim()
}

function extrairConteudo(svg) {
  const i = svg.indexOf('>')
  const f = svg.lastIndexOf('</svg>')
  return i !== -1 && f !== -1 ? svg.slice(i + 1, f) : ''
}

function extrairViewBox(svg) {
  const m = svg.match(/viewBox=["']([^"']+)["']/)
  return m ? m[1] : '0 0 24 24'
}

export function svgIcone(options) {
  const nome = normalizarNome(options && options.nome)
  const cor = (options && options.cor) || PADRAO.cor
  const tamanho = (options && options.tamanho) || PADRAO.tamanho
  const className = (options && options.className) || ''

  const original = ICONES[nome]
  if (!original) return null

  const chaveCache = `${nome}|${cor}|${tamanho}|${className}`
  const cacheado = CACHE.get(chaveCache)
  if (cacheado) return cacheado

  const viewBox = extrairViewBox(original)
  const conteudo = extrairConteudo(original).replace(/\s*fill="[^"]*"/g, '')
  const classAttr = className ? ` class="${className}"` : ''

  const svg = `<svg width="${tamanho}" height="${tamanho}" viewBox="${viewBox}" fill="${cor}" xmlns="http://www.w3.org/2000/svg"${classAttr}>${conteudo}</svg>`

  CACHE.set(chaveCache, svg)
  return svg
}

export function listarIcones() {
  return Object.keys(ICONES)
}

export function temIcone(nome) {
  return Boolean(ICONES[normalizarNome(nome)])
}

export function listarCategorias() {
  return CATEGORIAS.slice()
}

export function categoriaDoIcone(nome) {
  const m = META[normalizarNome(nome)]
  return m ? m.categoria : 'Outros'
}

// Ícones agrupados por categoria: { Navegação: [...], Ações: [...] }
export function iconesPorCategoria() {
  const grupos = {}
  for (const nome of Object.keys(ICONES)) {
    const cat = (META[nome] && META[nome].categoria) || 'Outros'
    if (!grupos[cat]) grupos[cat] = []
    grupos[cat].push(nome)
  }
  return grupos
}

// Busca inteligente: casa no nome E nas palavras-chave/sinônimos.
// Ex: "amor" encontra "coracao"; "deletar" encontra "lixeira"/"excluir".
export function buscarIcones(termo) {
  const t = normalizarNome(termo)
  if (!t) return listarIcones()
  const termos = t.split(/\s+/).filter(Boolean)

  const pontuar = (nome) => {
    const meta = META[nome]
    const palavras = meta ? meta.palavras : []
    const categoria = meta ? meta.categoria.toLowerCase() : ''
    let score = 0
    for (const termo of termos) {
      if (nome === termo) score += 100
      else if (nome.startsWith(termo)) score += 50
      else if (nome.includes(termo)) score += 25
      if (palavras.some((p) => p === termo)) score += 40
      else if (palavras.some((p) => p.startsWith(termo))) score += 20
      else if (palavras.some((p) => p.includes(termo))) score += 10
      if (categoria.includes(termo)) score += 8
    }
    return score
  }

  return Object.keys(ICONES)
    .map((nome) => ({ nome, score: pontuar(nome) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || a.nome.localeCompare(b.nome))
    .map((r) => r.nome)
}
