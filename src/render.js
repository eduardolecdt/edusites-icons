// Renderização do SVG a partir do nome — SEM depender de `meta.js`.
//
// Isolar isto de `core.js` é o que permite que o componente <SvgIcone> (e qualquer
// app que só renderiza ícones) NÃO arraste os ~300KB de metadados (descrições,
// palavras-chave) do `meta.js`. Só o SVG bruto sob demanda entra no bundle.
import { resolverBruto, resolverBrutoSync } from './resolvedor.js'

const PADRAO = { cor: '#000000', tamanho: 24 }

// Cache de SVGs já montados (por nome|cor|tamanho|classe).
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

function montar(bruto, nome, cor, tamanho, className) {
  const chaveCache = `${nome}|${cor}|${tamanho}|${className}`
  const cacheado = CACHE.get(chaveCache)
  if (cacheado) return cacheado

  const viewBox = extrairViewBox(bruto)
  const conteudo = extrairConteudo(bruto).replace(/\s*fill="[^"]*"/g, '')
  const classAttr = className ? ` class="${className}"` : ''

  const svg = `<svg width="${tamanho}" height="${tamanho}" viewBox="${viewBox}" fill="${cor}" xmlns="http://www.w3.org/2000/svg"${classAttr}>${conteudo}</svg>`

  CACHE.set(chaveCache, svg)
  return svg
}

function lerOpcoes(options) {
  return {
    nome: normalizarNome(options && options.nome),
    cor: (options && options.cor) || PADRAO.cor,
    tamanho: (options && options.tamanho) || PADRAO.tamanho,
    className: (options && options.className) || ''
  }
}

// Versão SÍNCRONA. Retorna o SVG montado se o bruto já estiver em cache; caso
// contrário dispara o carregamento em background e retorna null. Componentes
// reativos (SvgIcone.js) devem preferir `svgIconeAsync`.
export function svgIcone(options) {
  const { nome, cor, tamanho, className } = lerOpcoes(options)
  const bruto = resolverBrutoSync(nome)
  if (!bruto) return null
  return montar(bruto, nome, cor, tamanho, className)
}

// Versão ASSÍNCRONA. Resolve o SVG bruto sob demanda e monta o SVG final.
export async function svgIconeAsync(options) {
  const { nome, cor, tamanho, className } = lerOpcoes(options)
  const bruto = await resolverBruto(nome)
  if (!bruto) return null
  return montar(bruto, nome, cor, tamanho, className)
}
