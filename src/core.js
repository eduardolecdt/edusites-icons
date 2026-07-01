// Núcleo da lib. NÃO importa `icones.js` estaticamente — isso arrastaria os
// 2.3MB de SVGs pra qualquer bundle e mataria o tree-shaking. Metadados vêm de
// `meta.js` (pequeno, é a fonte de verdade); o SVG bruto vem sob demanda do
// `resolvedor.js` (via import.meta.glob no Vite, ou fallback dinâmico fora dele).
import { META, CATEGORIAS } from './meta.js'

// A renderização (svgIcone/svgIconeAsync) mora em `render.js`, que NÃO importa
// `meta.js`. Assim quem só renderiza ícones (o componente <SvgIcone>) não arrasta
// os ~300KB de metadados. Aqui apenas re-exportamos para manter a API pública.
export { svgIcone, svgIconeAsync } from './render.js'

// Todos os nomes de ícones, direto do META (fonte de verdade, sem o objeto gigante).
const NOMES = Object.keys(META)

function normalizarNome(nome) {
  return String(nome || '').toLowerCase().trim()
}

// Todos os nomes de ícones (fonte: META, não o objeto gigante).
export function listarIcones() {
  return NOMES.slice()
}

// Existência baseada em metadados (sem precisar carregar o SVG bruto).
export function temIcone(nome) {
  return Object.prototype.hasOwnProperty.call(META, normalizarNome(nome))
}

export function listarCategorias() {
  return CATEGORIAS.slice()
}

export function categoriaDoIcone(nome) {
  const m = META[normalizarNome(nome)]
  return m ? m.categoria : 'Outros'
}

// Descrição visual detalhada do desenho do ícone (forma, contorno/preenchido,
// elementos internos e o que representa). Feita para IAs escolherem o ícone certo.
export function descricaoDoIcone(nome) {
  const m = META[normalizarNome(nome)]
  return m && m.descricao ? m.descricao : ''
}

// Ícones agrupados por categoria: { Navegação: [...], Ações: [...] }
export function iconesPorCategoria() {
  const grupos = {}
  for (const nome of NOMES) {
    const cat = (META[nome] && META[nome].categoria) || 'Outros'
    if (!grupos[cat]) grupos[cat] = []
    grupos[cat].push(nome)
  }
  return grupos
}

// Versão da lib em que o ícone foi adicionado (ex: '1.4.0').
export function versaoDoIcone(nome) {
  const m = META[normalizarNome(nome)]
  return m && m.versao ? m.versao : '1.0.0'
}

// Ícones agrupados por versão: { '1.4.0': [...], '1.0.0': [...] }, ordenado da mais nova para a mais antiga.
export function iconesPorVersao() {
  const grupos = {}
  for (const nome of NOMES) {
    const v = (META[nome] && META[nome].versao) || '1.0.0'
    if (!grupos[v]) grupos[v] = []
    grupos[v].push(nome)
  }
  const ordenado = {}
  for (const v of Object.keys(grupos).sort((a, b) => compararVersao(b, a))) {
    ordenado[v] = grupos[v]
  }
  return ordenado
}

// Lista de versões existentes, da mais nova para a mais antiga.
export function listarVersoes() {
  const vs = new Set()
  for (const nome of NOMES) vs.add((META[nome] && META[nome].versao) || '1.0.0')
  return [...vs].sort((a, b) => compararVersao(b, a))
}

// Compara duas versões semver simples ('1.4.0' > '1.3.0'). Retorna -1, 0 ou 1.
function compararVersao(a, b) {
  const pa = String(a).split('.').map(Number)
  const pb = String(b).split('.').map(Number)
  for (let i = 0; i < 3; i++) {
    if ((pa[i] || 0) !== (pb[i] || 0)) return (pa[i] || 0) < (pb[i] || 0) ? -1 : 1
  }
  return 0
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
    const descricao = meta && meta.descricao ? meta.descricao.toLowerCase() : ''
    let score = 0
    for (const termo of termos) {
      if (nome === termo) score += 100
      else if (nome.startsWith(termo)) score += 50
      else if (nome.includes(termo)) score += 25
      if (palavras.some((p) => p === termo)) score += 40
      else if (palavras.some((p) => p.startsWith(termo))) score += 20
      else if (palavras.some((p) => p.includes(termo))) score += 10
      if (categoria.includes(termo)) score += 8
      // Descrição visual: peso baixo, ajuda buscas por forma ("circulo", "seta").
      if (descricao.includes(termo)) score += 5
    }
    return score
  }

  return NOMES
    .map((nome) => ({ nome, score: pontuar(nome) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || a.nome.localeCompare(b.nome))
    .map((r) => r.nome)
}

// Re-exporta utilitários de carregamento pra quem quiser controle fino.
export { resolverBruto, precarregar } from './resolvedor.js'
