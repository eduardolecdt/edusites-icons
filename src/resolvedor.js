// Resolvedor de SVG bruto — arquitetura de 3 camadas inspirada no @nuxt/icon,
// que dá tree-shaking no cliente SEM quebrar o `svgIcone()` síncrono.
//
// O dilema: com `<SvgIcone nome="casa">` (nome dinâmico em runtime) é impossível
// ter, ao mesmo tempo, (a) resolução síncrona, (b) tree-shaking e (c) nome
// dinâmico — o bundler não sabe o nome em build-time. A saída é separar por ambiente:
//
// - SERVIDOR (SSR/Node): o peso não vai pro cliente, então carregamos TODOS os
//   ícones do objeto monolítico e resolvemos SÍNCRONO. O `svgIcone()` volta a
//   retornar a string na hora (retrocompat 100%) e o SVG entra no HTML do SSR.
//   Esses ícones viajam no payload de hidratação — o cliente já os tem no cache.
//
// - CLIENTE: usamos `import.meta.glob` LAZY — cada ícone é um chunk separado,
//   baixado sob demanda. Só os ícones que aparecem entram no bundle (tree-shaking).
//   Ícones já resolvidos no SSR chegam quentes no cache; os que faltarem carregam
//   sob demanda (async, como qualquer lib de ícone dinâmica).

// ---- Detecção de ambiente ----
// import.meta.server/client existem no Nuxt/Vite. Fallback por typeof window.
function ehServidor() {
  try {
    if (typeof import.meta !== 'undefined' && typeof import.meta.server !== 'undefined') {
      return import.meta.server
    }
  } catch { /* noop */ }
  return typeof window === 'undefined'
}

// ---- Glob lazy (só resolvido pelo Vite; undefined fora dele) ----
let GLOB = null
try {
  if (typeof import.meta !== 'undefined' && typeof import.meta.glob === 'function') {
    GLOB = import.meta.glob('./icones/*.js')
  }
} catch { GLOB = null }

// Cache do SVG bruto (string) por nome.
const CACHE_BRUTO = new Map()

// ---- Monolítico (server bundle / fallback sem-Vite) ----
// Carregado via import DINÂMICO, então NUNCA entra no bundle do cliente Vite.
let monoliticoSync = null // objeto ICONES quando já carregado (síncrono a partir daí)
let promessaMono = null

function carregarMonoAsync() {
  if (monoliticoSync) return Promise.resolve(monoliticoSync)
  if (!promessaMono) {
    promessaMono = import('./icones.js').then((mod) => {
      monoliticoSync = mod.ICONES
      return monoliticoSync
    })
  }
  return promessaMono
}

// No servidor, carregamos o monolítico de forma BLOQUEANTE com top-level await,
// para que `svgIcone()` síncrono funcione já na primeira chamada (retrocompat).
// Top-level await no servidor não penaliza o cliente: o import é dinâmico, então
// o Vite mantém `icones.js` fora do bundle do cliente (só o servidor o carrega).
if (ehServidor()) {
  try {
    await carregarMonoAsync()
  } catch { /* segue com fallback async */ }
}

function chaveGlob(nome) {
  return `./icones/${nome}.js`
}

export function temGlob() {
  return GLOB !== null
}

// ---- Resolução assíncrona (caminho universal) ----
export async function resolverBruto(nome) {
  if (CACHE_BRUTO.has(nome)) return CACHE_BRUTO.get(nome)

  let bruto = null

  // No servidor, ou sem glob: usa o monolítico (tem tudo, custo só no server).
  if (ehServidor() || !GLOB) {
    const icones = await carregarMonoAsync()
    bruto = (icones && icones[nome]) || null
  } else {
    // Cliente com glob: chunk lazy sob demanda (tree-shaken).
    const carregar = GLOB[chaveGlob(nome)]
    if (carregar) {
      const mod = await carregar()
      bruto = (mod && mod.default) || null
    }
  }

  CACHE_BRUTO.set(nome, bruto)
  return bruto
}

// ---- Resolução síncrona (retrocompat de svgIcone) ----
// Servidor: resolve SÍNCRONO de verdade a partir do monolítico já carregado.
// Cliente: retorna do cache (quente via SSR) ou null — disparando o load async.
export function resolverBrutoSync(nome) {
  if (CACHE_BRUTO.has(nome)) return CACHE_BRUTO.get(nome)

  // Servidor com monolítico já em memória → resolve na hora.
  if (monoliticoSync) {
    const bruto = monoliticoSync[nome] || null
    CACHE_BRUTO.set(nome, bruto)
    return bruto
  }

  // Sem cache: dispara carregamento em background e retorna null (caller re-tenta
  // ou usa a versão async). No cliente, o SSR normalmente já preencheu o cache.
  resolverBruto(nome).catch(() => {})
  return null
}

// Pré-carrega ícones (warm-up). No cliente, útil pra garantir svgIcone síncrono.
export async function precarregar(nomes) {
  const lista = Array.isArray(nomes) ? nomes : [nomes]
  await Promise.all(lista.map((n) => resolverBruto(n)))
}

// Semeia o cache a partir de dados externos (ex: payload de hidratação do SSR).
export function semear(mapa) {
  if (!mapa) return
  for (const nome of Object.keys(mapa)) {
    if (!CACHE_BRUTO.has(nome)) CACHE_BRUTO.set(nome, mapa[nome])
  }
}
