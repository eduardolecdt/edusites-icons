<div align="center">

# @edusites/icons

**1088 ícones SVG em português-BR — tree-shakeable, para Vue, Nuxt, React, Svelte e JS puro. Cada ícone com descrição visual para IA.**

[![npm version](https://img.shields.io/npm/v/@edusites/icons?style=flat&colorA=18181B&colorB=28CF8D)](https://www.npmjs.com/package/@edusites/icons)
[![npm downloads](https://img.shields.io/npm/dm/@edusites/icons?style=flat&colorA=18181B&colorB=28CF8D)](https://www.npmjs.com/package/@edusites/icons)
[![minzip](https://img.shields.io/bundlephobia/minzip/@edusites/icons?style=flat&colorA=18181B&colorB=28CF8D)](https://bundlephobia.com/package/@edusites/icons)
[![license](https://img.shields.io/npm/l/@edusites/icons?style=flat&colorA=18181B&colorB=28CF8D)](./LICENSE)
[![icons](https://img.shields.io/badge/ícones-1088-28CF8D?style=flat&colorA=18181B)](https://lecdt.com/libs/icones)

[Galeria de ícones](https://lecdt.com/libs/icones) · [Release Notes](https://github.com/eduardolecdt/edusites-icons/releases) · [Changelog](./CHANGELOG.md)

</div>

## Por que `@edusites/icons`?

- 🇧🇷 **Nomes em português-BR** — `casa`, `lixeira`, `cadeado`, `seta-direita`. Sem tradução mental.
- 🤖 **Descrições para IA** — cada ícone tem uma descrição visual do desenho, para que agentes de IA escolham o ícone certo sem ver a imagem.
- 🌳 **Tree-shakeable** — seu app baixa **só os ícones que usa**, não os 1088.
- ⚡ **Multi-framework** — Vue, Nuxt, React, Svelte e JS puro. Zero dependências no núcleo.
- 🎨 **Herança de cor e tamanho** — funciona como um ícone de fonte (`currentColor` / `1em`).
- 🏦 **Feito para o Brasil** — bancos, fintechs e meios de pagamento brasileiros + as marcas mais usadas do mundo.

## Instalação

```bash
npm install @edusites/icons
# ou
pnpm add @edusites/icons
# ou
yarn add @edusites/icons
```

## Uso

> **Sem Vue no projeto?** (React, Svelte, JS puro) importe de `@edusites/icons/core` — a função `svgIcone` pura, **sem dependências**. O entrypoint raiz também exporta o componente Vue `SvgIcone`, por isso requer Vue.

### Nuxt (uso global, sem imports)

Registre **uma vez** e use `<SvgIcone>` em qualquer página, sem importar nada.

`plugins/edusites-icons.js`:

```js
import { instalarIcones } from '@edusites/icons/nuxt'

export default defineNuxtPlugin((nuxtApp) => {
  instalarIcones(nuxtApp)
})
```

Pronto:

```vue
<template>
  <SvgIcone nome="whatsapp" />
  <SvgIcone nome="cadeado" cor="#d4a843" :tamanho="32" />
  <SvgIcone nome="seta-direita" cor="var(--cor-ouro)" :tamanho="20" />
</template>
```

**Herança (como um ícone de fonte):** sem `cor`, o ícone usa `currentColor` (herda `color` do CSS). Sem `tamanho`, usa `1em` (escala com o `font-size`).

```vue
<template>
  <span class="botao"><SvgIcone nome="download" /> Baixar</span>
</template>

<style>
.botao { color: #fff; font-size: 20px; }
</style>
```

### Vue 3 (import direto)

```vue
<script setup>
import { SvgIcone } from '@edusites/icons'
</script>

<template>
  <SvgIcone nome="estrela" cor="#d4a843" :tamanho="48" />
</template>
```

### JavaScript puro

```javascript
import { svgIcone } from '@edusites/icons/core'

const svg = svgIcone({ nome: 'whatsapp' })
document.getElementById('app').innerHTML = svg

const dourado = svgIcone({ nome: 'estrela', cor: '#d4a843', tamanho: 48 })
```

### React

```jsx
import { svgIcone } from '@edusites/icons/core'

function Icone({ nome, cor, tamanho }) {
  const svg = svgIcone({ nome, cor, tamanho }) || ''
  return <span dangerouslySetInnerHTML={{ __html: svg }} />
}
```

### Svelte

```svelte
<script>
  import { svgIcone } from '@edusites/icons/core'
  export let nome, cor = undefined, tamanho = undefined
  $: svg = svgIcone({ nome, cor, tamanho }) || ''
</script>

{@html svg}
```

## Parâmetros

| Propriedade | Tipo     | Obrigatório | Padrão          | Descrição                                  |
| ----------- | -------- | ----------- | --------------- | ------------------------------------------ |
| `nome`      | `string` | ✅ Sim      | —               | Nome do ícone (ex: `casa`)                 |
| `cor`       | `string` | ❌ Não      | `currentColor`¹ | Cor (hex/rgb/var CSS)                       |
| `tamanho`   | `number` | ❌ Não      | `1em`¹          | Tamanho em pixels                          |
| `className` | `string` | ❌ Não      | —               | Classe CSS aplicada ao `<svg>`             |

¹ No componente `<SvgIcone>`, o padrão é herdar do CSS. Na função `svgIcone()` pura, os padrões são `#000000` e `24`.

## Descrições para IA 🤖

Cada um dos 1088 ícones tem uma **descrição visual detalhada** do desenho — forma geométrica, se é contorno ou preenchido, elementos internos e o que representa. Foram escritas lendo o SVG real, não o nome, para que **agentes de IA escolham o ícone certo por como ele se parece**:

```javascript
import { descricaoDoIcone, buscarIcones } from '@edusites/icons/core'

descricaoDoIcone('cofrinho-porco')
// 'Silhueta lateral preenchida de um cofrinho em formato de porquinho, com corpo
//  oval robusto, focinho arredondado, orelha triangular, quatro perninhas e uma
//  fenda nas costas para inserir moedas — representa poupança ou guardar dinheiro.'
```

A descrição também alimenta a busca. Termos **visuais** encontram os ícones mesmo que não estejam no nome:

```javascript
buscarIcones('telhado')    // ['casa', 'casa-fina', ...]   (todas as casas)
buscarIcones('montadora')  // ['bmw', 'ferrari', 'honda', ...]
buscarIcones('streaming')  // ['netflix', 'disney', 'spotify', ...]
```

## Funções utilitárias

```javascript
import {
  listarIcones, temIcone, buscarIcones,
  listarCategorias, categoriaDoIcone, iconesPorCategoria,
  descricaoDoIcone, listarVersoes, versaoDoIcone, iconesPorVersao,
  svgIconeAsync, precarregar
} from '@edusites/icons/core'

listarIcones()               // ['aba', 'abajur', 'abelha', ...]
temIcone('whatsapp')         // true
buscarIcones('deletar')      // ['lixeira', ...] — busca por nome, sinônimos, categoria e descrição
listarCategorias()           // ['Ações', 'Animais', 'Bancos', ...]
categoriaDoIcone('nubank')   // 'Bancos'
iconesPorCategoria()         // { 'Bancos': ['nubank', ...], ... }
descricaoDoIcone('casa')     // 'Silhueta frontal preenchida de uma casa...'
versaoDoIcone('nike')        // '1.5.0'
iconesPorVersao()            // { '1.5.0': [...], '1.0.0': [...] }
await svgIconeAsync({ nome: 'casa' }) // versão async (resolve sob demanda)
await precarregar(['casa', 'nike'])   // pré-carrega ícones no cache
```

## Tree-shaking & bundle size 🌳

Cada ícone é um módulo individual, então **seu bundle inclui só os ícones que você usa** — não a biblioteca inteira. Um app com 20 ícones baixa ~20 ícones, não os 1088.

- No **Vite/Nuxt**, cada ícone vira um _chunk_ separado, carregado sob demanda.
- No **SSR**, os ícones são resolvidos de forma síncrona e já saem no HTML (bom para SEO, sem _flash_).
- Em **JS puro / Node**, tudo funciona via um _fallback_ interno.

> [!TIP]
> Use `<SvgIcone nome="casa" />` normalmente — o carregamento sob demanda é automático. Para garantir um ícone antes de renderizar (ex: gerar SVG num handler), use `await precarregar(['casa'])` ou `svgIconeAsync()`.

## Ícones disponíveis

**1088 ícones** organizados em 32 categorias. Explore e busque todos na **[galeria online](https://lecdt.com/libs/icones)**.

Categorias: Ações · Alinhamento · Animais · Bancos · Casa · Clima · Comida · Comunicação · Comércio · Corpo & Saúde · Cursor · Desenvolvimento · Dispositivos · Documentos · Educação · Financeiro · Gráficos · Imóveis · Interface · Lugares · Marketing · Multimídia · Móveis · Natureza · Navegação · Objetos · Redes Sociais · Segurança · Tecnologias · Tempo · Usuário · Veículos.

> Programaticamente: `listarIcones()`, `buscarIcones(termo)`, `iconesPorCategoria()`.

## Marcas registradas / Trademark ⚠️

Esta biblioteca inclui logotipos de marcas (big techs, bancos, cartões, delivery, etc.), fornecidos apenas para fins de **identificação e interoperabilidade**. Esses logos são **propriedade de seus respectivos donos** e sua inclusão **não implica endosso ou afiliação**.

O **código** desta biblioteca é licenciado sob MIT. O **uso dos logos de marca** é de responsabilidade de quem os utiliza e deve respeitar as diretrizes de marca de cada empresa. Ícones que são marcas têm `marca: true` nos metadados.

## Contribuindo 🙏

Contribuições são bem-vindas! Veja o [guia de contribuição](./CONTRIBUTING.md) para adicionar um novo ícone.

## Licença 📎

[MIT](./LICENSE) © [Lecdt.com — Eduardo Sites](https://lecdt.com). Os logos de marca pertencem aos seus respectivos donos (veja **Marcas registradas / Trademark**).
