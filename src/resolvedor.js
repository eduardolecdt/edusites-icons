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

// ---- Hidratação: recupera do DOM os ícones que o SSR já renderizou ----
//
// O SSR resolve os ícones síncrono e escreve o <svg> inteiro no HTML. Sem esta
// etapa, o cliente hidratava com o cache VAZIO e ia buscar de novo, um por um,
// ícones que já estavam desenhados na tela — e, quando o `watchEffect` do
// componente disputava com o glob, o caminho async acabava puxando o monolítico
// de 2,4 MB. Lendo o que já veio no HTML, o cache nasce quente e o cliente não
// baixa nada para o primeiro paint.
//
// Reexecutável, mas com FREIO.
//
// Em SPA cada tela traz ícones novos no DOM, então um `semeadoDoDom = true`
// definitivo faria a lib ignorar tudo que chegasse depois da primeira página —
// era por isso que, ao voltar para uma tela já visitada, os ícones sumiam.
//
// O freio existe porque agora NÃO cacheamos falha: um ícone que não resolve
// volta a pedir, e sem o intervalo cada tentativa varreria o DOM inteiro com
// `querySelectorAll` — em laço, com o watchEffect do componente re-tentando.
// 200ms é curto o bastante para uma navegação nova ser semeada na hora, e longo
// o bastante para não virar varredura contínua.
let ultimaSemeadura = 0

function semearDoDom() {
  if (typeof document === 'undefined') return

  const agora = Date.now()
  if (agora - ultimaSemeadura < 200) return
  ultimaSemeadura = agora

  try {
    const nos = document.querySelectorAll('[data-icone]')
    for (const no of nos) {
      const nome = no.getAttribute('data-icone')
      const svg = no.firstElementChild
      if (!nome || !svg || CACHE_BRUTO.has(nome)) continue
      // Guarda o SVG cru como veio do servidor. `montar()` reextrai viewBox e
      // conteúdo depois, então o formato aqui é o mesmo do arquivo do ícone.
      CACHE_BRUTO.set(nome, svg.outerHTML)
    }
  } catch { /* DOM indisponível: segue pelo caminho async normal */ }
}

// ---- Resolução assíncrona (caminho universal) ----
export async function resolverBruto(nome) {
  if (CACHE_BRUTO.has(nome)) return CACHE_BRUTO.get(nome)

  // Antes de sair buscando na rede, aproveita o que o SSR já pintou na tela
  if (!ehServidor()) {
    semearDoDom()
    if (CACHE_BRUTO.has(nome)) return CACHE_BRUTO.get(nome)
  }

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

  /*
   * SÓ cacheia SUCESSO.
   *
   * Cachear `null` matava o ícone para o resto da sessão: a primeira linha desta
   * função é `if (CACHE_BRUTO.has(nome)) return CACHE_BRUTO.get(nome)`, então um
   * null gravado aqui era devolvido em toda tentativa seguinte — nem remontar o
   * componente recuperava.
   *
   * Onde isso aparecia: em app com SSR, o monolítico é aliasado para um stub
   * vazio no build do cliente (para não arrastar 2,4 MB de SVG ao bundle). Na
   * navegação interna não há SSR, então o ícone é pedido pela primeira vez no
   * navegador, o stub responde {}, e `bruto` vinha null. Sintoma medido: a home
   * abria com 8 ícones e 0 vazios; ao entrar num artigo e VOLTAR, 7 dos 8 sumiam
   * e só um F5 recuperava.
   *
   * Sem o cache da falha, a próxima chamada tenta de novo — e o glob resolve.
   */
  if (bruto) CACHE_BRUTO.set(nome, bruto)
  return bruto
}

// ---- Resolução síncrona (retrocompat de svgIcone) ----
// Servidor: resolve SÍNCRONO de verdade a partir do monolítico já carregado.
// Cliente: retorna do cache (quente via SSR) ou null — disparando o load async.
export function resolverBrutoSync(nome) {
  if (CACHE_BRUTO.has(nome)) return CACHE_BRUTO.get(nome)

  // Cliente: o ícone pode já estar desenhado na página pelo SSR. Resolver daí é
  // síncrono de verdade — o componente nem chega a mostrar o placeholder.
  if (!ehServidor()) {
    semearDoDom()
    if (CACHE_BRUTO.has(nome)) return CACHE_BRUTO.get(nome)
  }

  /*
   * Servidor com monolítico já em memória → resolve na hora.
   *
   * A guarda `ehServidor()` é essencial. No CLIENTE de um app com SSR o
   * `monoliticoSync` costuma ser um STUB VAZIO — os bundlers aliasam
   * `icones.js` para um `{}` de propósito, para não arrastar 2,4 MB de SVG ao
   * bundle. Como `{}` é truthy, este bloco era executado no navegador, fazia
   * `{}[nome] || null` e CACHEAVA o null: o ícone morria para o resto da
   * sessão, mesmo com o chunk individual disponível.
   *
   * E cacheia só o que encontrou: gravar a falha impede a re-tentativa, já que
   * a primeira linha da função devolve o que estiver no cache.
   */
  if (ehServidor() && monoliticoSync) {
    const bruto = monoliticoSync[nome] || null
    if (bruto) CACHE_BRUTO.set(nome, bruto)
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
