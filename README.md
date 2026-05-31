# @edusites/icons

[![NPM Version](https://img.shields.io/npm/v/@edusites/icons)](https://www.npmjs.com/package/@edusites/icons)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Biblioteca JavaScript para renderizar ícones SVG. Os ícones são **pretos por padrão**, e você pode customizar apenas **cor** e **tamanho**.

## Instalação

```bash
npm install @edusites/icons
```

```bash
yarn add @edusites/icons
```

```bash
pnpm add @edusites/icons
```

## Uso

> **Sem Vue no projeto?** (React, Svelte, JS puro) importe de `@edusites/icons/core` — é a função `svgIcone` pura, **sem nenhuma dependência**. O entrypoint raiz (`@edusites/icons`) também exporta o componente Vue `SvgIcone`, por isso requer Vue instalado.

### JavaScript Puro

```javascript
import { svgIcone } from '@edusites/icons/core'

// Ícone preto, 24px (padrão)
const svg = svgIcone({ nome: 'whatsapp' })
document.getElementById('app').innerHTML = svg

// Cor e tamanho customizados
const dourado = svgIcone({ nome: 'estrela', cor: '#d4a843', tamanho: 48 })
```

### Nuxt 3 (uso global, sem imports)

Registre **uma vez** e use `<SvgIcone>` em qualquer página/componente, sem importar nada — igual ao Font Awesome.

Crie `plugins/edusites-icons.js`:

```js
export { default } from '@edusites/icons/nuxt'
```

Pronto. Agora em qualquer lugar:

```vue
<template>
  <SvgIcone nome="whatsapp" />
  <SvgIcone nome="cadeado" cor="#d4a843" :tamanho="32" />
  <SvgIcone nome="seta-direita" cor="var(--cor-ouro)" :tamanho="20" />
</template>
```

### Vue 3 (import direto)

A lib também exporta o componente `SvgIcone` para import manual:

```vue
<script setup>
import { SvgIcone } from '@edusites/icons'
</script>

<template>
  <SvgIcone nome="whatsapp" />
  <SvgIcone nome="estrela" cor="#d4a843" :tamanho="48" />
</template>
```

Ou crie seu próprio wrapper a partir de `svgIcone`:

```vue
<script setup>
import { svgIcone } from '@edusites/icons'
import { ref, watchEffect } from 'vue'

const props = defineProps({
  nome: { type: String, required: true },
  cor: String,
  tamanho: Number
})

const svg = ref('')
watchEffect(() => {
  svg.value = svgIcone({ ...props }) || ''
})
</script>

<template>
  <span v-html="svg"></span>
</template>
```

### React

```jsx
import { svgIcone } from '@edusites/icons/core'

function Icone({ nome, cor, tamanho }) {
  const svg = svgIcone({ nome, cor, tamanho }) || ''
  return <span dangerouslySetInnerHTML={{ __html: svg }} />
}

export default function App() {
  return (
    <div>
      <Icone nome="whatsapp" />
      <Icone nome="estrela" cor="#d4a843" tamanho={48} />
    </div>
  )
}
```

### Svelte

```svelte
<script>
  import { svgIcone } from '@edusites/icons/core'

  export let nome
  export let cor = undefined
  export let tamanho = undefined

  $: svg = svgIcone({ nome, cor, tamanho }) || ''
</script>

{@html svg}
```

## Parâmetros

| Propriedade | Tipo     | Obrigatório | Padrão      | Descrição                       |
| ----------- | -------- | ----------- | ----------- | ------------------------------- |
| `nome`      | `string` | ✅ Sim      | -           | Nome do ícone                   |
| `cor`       | `string` | ❌ Não      | `"#000000"` | Cor do ícone (hex/rgb/var CSS)  |
| `tamanho`   | `number` | ❌ Não      | `24`        | Tamanho em pixels               |
| `className` | `string` | ❌ Não      | -           | Classe CSS aplicada ao `<svg>`  |

## Funções Utilitárias

```javascript
import { listarIcones, temIcone, buscarIcones, iconesPorCategoria, listarCategorias } from '@edusites/icons/core'

listarIcones() // ['aba', 'acaro', 'adicionar-usuario', ...]
temIcone('whatsapp') // true
temIcone('inexistente') // false
buscarIcones('deletar') // ['lixeira', ...] — busca por nome, sinônimos e categoria
listarCategorias() // ['Ações', 'Alinhamento', 'Animais', 'Bancos', ...]
iconesPorCategoria() // { 'Bancos': ['nubank', 'itau', ...], ... }
```

## Ícones Disponíveis

A biblioteca conta com **563 ícones** (nomes em português), organizados em 32 categorias — incluindo uma categoria **Bancos** com os principais bancos, fintechs e gateways de pagamento brasileiros. Lista completa:

`aba` · `acaro` · `adicionar-usuario` · `agenda` · `agibank` · `agro` · `ajustes` · `alfinete` · `alinhar-centro` · `alinhar-direita` · `alinhar-esquerda` · `alinhar-justificado` · `alto-falante` · `altura` · `alvo` · `alvo-mira` · `ampulheta` · `analise` · `analytics` · `antecipacoes` · `aperto-maos` · `arquivar` · `arquivo` · `arquivos` · `arrastar` · `arroba` · `arroba-destaque` · `asaas` · `assinatura-premium` · `assinaturas` · `asteristico` · `asteristico-2` · `atencao` · `atendimento` · `atualizar` · `avatar` · `avenue` · `aviao` · `avisos` · `backup` · `balanca` · `bambu` · `banco` · `bancodobrasil` · `banheira` · `barco` · `bebe` · `bicicletario` · `biomecanica` · `biometria` · `bitcoin` · `blindado` · `blog` · `bloquear` · `bmg` · `boca` · `boleto` · `bonus` · `borda` · `borda-dupla` · `borda-solida` · `borda-tracejada` · `braco` · `bradesco` · `brinquedoteca` · `bs2` · `btg` · `bv` · `c6` · `cabra` · `cachorro` · `cadeado` · `cadeado-aberto` · `cadeado-redondo` · `cadeira` · `cadeira-madeira` · `caixa` · `calculadora` · `calendario` · `cama` · `cama-casal` · `cama-solteiro` · `camera` · `caminhao` · `caminhao-entrega` · `caminhonete` · `caminhonete-cabine-dupla` · `camiseta` · `campo` · `caneca` · `caneta` · `canto-arredondado` · `capacete-protecao` · `carne` · `carrinho` · `carrinho-bebe` · `carro` · `carro-banco` · `cartao` · `cartas-jogo` · `carteira` · `casa` · `casa-dinheiro` · `casa-estilo` · `casa-fina` · `casa-mao` · `casa-quadrados` · `casa-tamanho` · `catalogo` · `cavalo` · `celular` · `cerebro` · `cerebro-ia` · `certificado` · `certo` · `cesta-basquete` · `chave` · `check` · `check-circulo` · `check-duplo` · `check-escudo` · `check-limpo` · `check-linha` · `check-onda` · `check-redondo` · `chuveiro` · `cinema` · `citacao` · `classico` · `cliente-aniversario` · `clientes` · `clientes-estrela` · `cobrancas` · `codigo` · `codigo-bloco` · `codigo-de-barras` · `coelho` · `colaborador` · `coluna` · `compacto` · `compartilhar` · `compradores` · `computador` · `contrato` · `contrato-assinar` · `contrato-dinheiro` · `contratos` · `conveniencias` · `conversa` · `conversas` · `conversivel` · `copiar` · `cora` · `coracao` · `coracao-circulo` · `coroa` · `costas` · `crescimento` · `cronometro` · `cubo` · `cupe` · `cursor` · `cursor-ajuda` · `cursor-bloqueado` · `cursor-espera` · `cursor-mira` · `cursor-mover` · `cursor-ponteiro` · `cursor-progresso` · `cursor-proibido` · `cursor-redimensionar-linha` · `cursor-rolar` · `cursor-texto` · `curva` · `dashboard` · `debug` · `deck-molhado` · `dedo` · `desfazer` · `design` · `desktop` · `desligar` · `despesas` · `detalhes` · `diamante` · `digio` · `digitalocean` · `dinheiro` · `doacao` · `docker` · `documento` · `documento-atencao` · `documento-check` · `documento-fiscal` · `documento-linhas` · `download` · `duvida` · `duvida-quadrado` · `editar` · `efibank` · `elevador` · `elevador-social` · `empresa` · `engrenagem` · `enquadrar` · `entrar` · `entrega` · `envelope-1` · `envelope-2` · `envelope-3` · `enviar` · `equipe` · `escala` · `escavadeira` · `escola` · `escudo` · `escudo-check` · `espaco` · `espaco-gourmet` · `espelhar` · `esportivo` · `esquilo` · `estrela` · `expandir` · `exportar` · `extensao` · `externo` · `facebook` · `faceid` · `fatura` · `fechar` · `feedback` · `feliz` · `feminino` · `ferramenta` · `figma` · `filme` · `filtro` · `filtro-limpar` · `financeiro` · `fitness-ao-ar-livre` · `flor` · `fogo` · `foguete` · `folha` · `folhas` · `fonte` · `formas` · `formatura` · `formulario` · `fornecedores` · `fotos` · `frutas` · `galinha` · `gato` · `germe` · `girar` · `globo` · `gota` · `gota-tinta` · `grafico` · `grafico-dinheiro` · `graficos` · `guarda-chuva` · `hashtag` · `hatch` · `headset` · `helicoptero` · `historico` · `hospital` · `ia` · `ia-brilho` · `identidade` · `idioma` · `igreja` · `imagem` · `importar` · `imprimir` · `infinitepay` · `infinito` · `info` · `ingresso` · `instagram` · `institucional` · `integracoes` · `inter` · `internet` · `italico` · `itau` · `iugu` · `jardim` · `javascript` · `jet-ski` · `lampada` · `lancha` · `laranja` · `layout` · `like` · `limao` · `limousine` · `link` · `linkedin` · `lista` · `livro` · `livros` · `lixeira` · `loading` · `local-estrela` · `localizacao` · `lotus` · `lua` · `lua-estrelas` · `lupa` · `maca` · `mais` · `mais-caixa` · `mais-circulo` · `mais-fino` · `manual` · `mao-dinheiro` · `maos-juntas` · `maos-unidas` · `mapa` · `marcador` · `martelo` · `martelo-juiz` · `masculino` · `medalha` · `medalha-aprovada` · `megafone` · `megafone-anuncio` · `menos` · `menos-caixa` · `menu` · `menu-curto` · `mercadopago` · `mercantil` · `microfone` · `microonibus` · `migrar` · `minimizar` · `minivan` · `modelo` · `modo` · `mofo` · `monitor` · `monitor-info` · `morango` · `moto` · `moto-chopper` · `moto-classic` · `moto-cross` · `moto-touring` · `mundo` · `musica` · `n8n` · `negocio` · `neon` · `next` · `ngcash` · `nginx` · `nomad` · `notas` · `notas-fiscais` · `noticias` · `nubank` · `nuvem` · `nuxt` · `oculto` · `olho` · `ombro` · `ondas` · `onibus` · `online` · `opcoes` · `orcamentos` · `ordem-alfabetica-a-z` · `ordem-alfabetica-z-a` · `ordenar` · `ordenar-az` · `ordenar-baixo` · `ordens` · `original` · `otimizacao` · `pagbank` · `paleta` · `pan` · `papagaio` · `parceiro` · `parques` · `pasta` · `pata` · `patinete` · `pausa` · `paypal` · `peito` · `perfil` · `perna` · `personalizar` · `perua` · `pessoa-laptop` · `pessoas` · `pessoas-grupo` · `picpay` · `pintinho` · `piscina` · `piscina-adulto` · `pix` · `play` · `play-cheio` · `policia` · `poltrona` · `poltrona-luxo` · `pontinhos` · `porcentagem` · `porco` · `portaria` · `posvenda` · `pouco-estoque` · `prancheta-assinar` · `preco` · `predio` · `premium` · `presente` · `produtos` · `proibido` · `projetos` · `proposta` · `propostas` · `proprietario` · `puzzle` · `quadrado` · `quadrados` · `quadros` · `raio` · `raio-relampago` · `ranking` · `real` · `receitas` · `recibo` · `refeicao` · `regua` · `regua-reta` · `relatorio` · `relogio` · `renda-extra` · `repetir` · `responsivo` · `reticencias-circulo` · `retorno` · `reuniao` · `revolut` · `rico` · `robo` · `sacola` · `safra` · `sair` · `salao-de-festas` · `salvar` · `sangue` · `santander` · `sauna` · `scooter` · `script` · `sedan` · `seguranca` · `selo` · `servidor` · `seta` · `seta-baixo` · `seta-baixo-fina` · `seta-cima` · `seta-cima-fina` · `seta-circulo` · `seta-circulo-cheia` · `seta-curva` · `seta-direita` · `seta-direita-fina` · `seta-dupla` · `seta-esquerda` · `seta-esquerda-fina` · `seta-fina` · `seta-link` · `seta-upload` · `setinha` · `setinha-baixo` · `sicoob` · `sicredi` · `simbolo-dolar` · `simbolo-euro` · `simbolo-real` · `sincronizar` · `sino` · `smartwatch` · `sofa` · `sofa-dois` · `sofa-tres` · `sol` · `solarium` · `sorvete` · `stone` · `street-view` · `stripe` · `subindo` · `suv` · `taca` · `tag` · `talheres` · `tamanho` · `tapete` · `tarefa` · `tarefas` · `teclado` · `telefone` · `tesoura` · `ticket` · `tiktok` · `tomada` · `tomate` · `ton` · `toque` · `transferencia` · `transferencias` · `transferir` · `transmissao` · `transporte` · `treino-cinco` · `treino-dois` · `treino-quatro` · `treino-seis` · `treino-tres` · `treino-um` · `triciculo` · `trofeu` · `universidade` · `upload` · `usuario` · `usuario-adicionar` · `usuario-circulo` · `usuarios` · `vaca` · `van` · `varinha-magica` · `veia` · `venda` · `video` · `visao-cards` · `visao-lista` · `visao-slide` · `visitas` · `whatsapp` · `whatsapp-ia` · `wifi` · `wise` · `wordpress` · `x` · `x-fino` · `x-redondo` · `xp` · `yoga` · `youtube` · `zoom-mais` · `zoom-menos`

> Use `listarIcones()`, `buscarIcones(termo)` e `iconesPorCategoria()`.

## Licença

MIT © [Lecdt.com](https://lecdt.com)

---

**Desenvolvido por [@edusites](https://instagram.com/edusites) na [Lecdt.com](https://lecdt.com)**
