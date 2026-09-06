# Changelog

Todas as mudanças relevantes deste projeto são documentadas aqui.
O formato segue o [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/)
e o projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [1.6.2] - 2026-09-06

### Corrigido
- **Ícone sumia ao voltar para uma tela já visitada, em app com SSR.** Medido
  numa central de ajuda: a home abria com 8 ícones e 0 vazios; ao entrar num
  artigo e voltar, 7 dos 8 sumiam — e só um F5 recuperava. O mesmo mecanismo
  deixava sem ícone qualquer bloco que só monta após interação (um aviso dentro
  de `v-if`), enquanto o MESMO ícone aparecia normal noutro ponto da página.

  Eram duas causas somadas:

  1. `resolverBrutoSync` entrava no ramo do monolítico **no cliente**. Em app
     com SSR o `icones.js` é aliasado para um stub vazio no build do cliente
     (para não arrastar 2,4 MB de SVG ao bundle), e `{}` é *truthy*: o bloco
     rodava no navegador, fazia `{}[nome] || null` e seguia com `null`. Agora
     exige `ehServidor()`.

  2. Os dois resolvedores **cacheavam a falha**. Como ambos começam com
     `if (CACHE_BRUTO.has(nome)) return CACHE_BRUTO.get(nome)`, um `null`
     gravado era devolvido em toda tentativa seguinte: o ícone morria para o
     resto da sessão, e nem remontar o componente recuperava.

- **Ausência confirmada continua sendo cacheada.** A correção acima distingue
  *"este ícone não existe"* de *"não consegui carregar agora"* — a mesma
  separação que o Iconify faz entre `null` e `undefined`. Um nome que a lib
  realmente não tem é lembrado (não custa uma tentativa a cada render); uma
  falha de carregamento deixa o caminho aberto para a próxima chamada.

### Notas
- Sem breaking change: a API pública não muda.
- Quem já estava na 1.6.1 ganha a correção sem tocar em código de aplicação.
- Não é preciso manter listas de "ícones para precarregar" na aplicação: esse
  workaround existia justamente para contornar o cache envenenado.

## [1.6.1] - 2026-08-10

### Corrigido
- **Hidratação deixa de baixar o monolítico de 2,4 MB.** Em app com SSR, o
  servidor já resolvia os ícones e escrevia o `<svg>` inteiro no HTML, mas o
  cliente hidratava com o cache vazio e ia buscar tudo de novo — na prática
  puxando `icones.js` inteiro (763 KB comprimidos) para desenhar ícones que já
  estavam na tela. Agora o resolvedor recupera do próprio DOM o que o SSR
  renderizou (`semearDoDom`), então o cache nasce quente e o primeiro paint não
  custa nenhuma requisição de ícone.
- `<SvgIcone>` passou a emitir `data-icone="<nome>"` no wrapper. É esse atributo
  que permite a recuperação acima, e de quebra mostra no inspetor qual ícone é
  qual.

### Notas
- Sem breaking change: a API pública (`svgIcone`, `svgIconeAsync`, `precarregar`,
  `semear`) não mudou. Quem não usa SSR segue pelo caminho de sempre.
- Ícone que só aparece depois (modal, aba trocada) continua carregando sob
  demanda pelo chunk individual, como antes.

## [1.6.0] - 2026-08-06

### Adicionado
- **Conjunto `gestao-dev`** — 109 ícones de UI desenhados sob a mesma grade
  (viewBox `0 0 100 100`, área útil 16–84, traço já convertido em contorno),
  todos com o prefixo `gd-`: `gd-check`, `gd-lixeira`, `gd-calendario`… O prefixo
  existe porque 95 desses nomes já pertenciam ao conjunto `base`; com ele os
  desenhos antigos continuam valendo e nenhum projeto muda de visual ao atualizar.
- **API de conjuntos** — um conjunto é a família de origem do ícone: ícones do
  mesmo conjunto foram desenhados juntos, sob as mesmas regras, e combinam entre
  si na mesma tela. Enquanto `categoria` responde "sobre o que é?", `conjunto`
  responde "com quais outros ele combina?".
  - `conjuntoDoIcone(nome)` — o conjunto do ícone (`'base'` por padrão)
  - `listarConjuntos()` — `['base', 'gestao-dev']`
  - `iconesPorConjunto()` — os nomes agrupados por conjunto
  - `mesmoConjunto(...nomes)` — `true` se todos combinam visualmente
  - `CONJUNTO_PADRAO` — `'base'`, o conjunto dos ícones anteriores a este campo
- A busca passa a considerar o conjunto: `buscarIcones('gestao-dev')` traz a
  família inteira.

### Alterado
- **1197 ícones** no total (antes: 1088).
- Os ícones `gd-*` têm o `viewBox` recortado no desenho real, e não no frame
  100×100 que o Figma exporta. Aquele frame trazia ~30% de padding transparente
  embutido — e em quantidade desigual (`gd-x` ocupava 48 de 100, `gd-pix` 76),
  então dois ícones do mesmo `font-size` saíam com pesos visuais diferentes.
  Agora o eixo maior encosta nas bordas: **1,39× maior em média**, até 2× no
  `gd-x`. O desenho não mudou — o viewBox é um quadrado centrado no bounding
  box, então a proporção é preservada e ícones estreitos (`gd-menos`,
  `gd-pausa`) não esticam.

## [1.5.1] - 2026-07-01

### Corrigido
- **SSR**: o componente `<SvgIcone>` renderizava um espaço vazio no HTML do
  servidor (o SVG só aparecia após a hidratação), prejudicando SEO e causando um
  breve _flash_. Agora o ícone é resolvido de forma síncrona no SSR e já sai no
  HTML inicial, sem perder o _tree-shaking_ no cliente.

## [1.5.0] - 2026-07-01

### Adicionado
- **1088 ícones** no total (antes: 570). Novos: 40 setas e gráficos, 194 ícones
  gerais (clima, comida, esporte, saúde, natureza, dev, móveis, emojis, e-commerce),
  e 166 logos de marcas (bancos, big techs, cartões, delivery e as marcas mais
  valiosas do mundo). Veja **Marcas e trademark** no README.
- **Tree-shaking / carregamento sob demanda**: cada ícone virou um módulo
  individual (`src/icones/<nome>.js`). Apps agora baixam **apenas os ícones que
  usam**, em vez da biblioteca inteira. No SSR os ícones são resolvidos de forma
  síncrona e entram no HTML.
- Função `svgIconeAsync()` — versão assíncrona de `svgIcone()`, recomendada em
  ambientes com bundler (resolve o ícone sob demanda).
- Funções de versão: `versaoDoIcone()`, `iconesPorVersao()`, `listarVersoes()`.
- `precarregar(nomes)` — pré-carrega ícones (warm-up do cache).
- Campo `versao` em cada ícone (metadados) — indica em que versão o ícone entrou.
- **Descrições visuais para IA** em todos os 1088 ícones: cada ícone tem uma
  descrição detalhada do desenho (forma, contorno/preenchido, elementos, o que
  representa), pensada para que agentes de IA escolham o ícone certo. Alimenta a
  busca (`buscarIcones('telhado')` acha todas as casas).

### Corrigido
- Ícones que usavam `stroke` com cor fixa ou fundo semi-transparente (`proibido`,
  `check-circulo`, `coracao-circulo`, `usuario-circulo`, `arroba`, entre outros)
  foram refeitos como silhuetas 100% sólidas, herdando a cor corretamente.
- `LICENSE` reescrita no texto MIT oficial (reconhecida pelo GitHub).

### Compatibilidade
- `svgIcone()` síncrono continua funcionando (resolve via SSR). Nenhuma mudança
  na forma de importar ou usar `<SvgIcone>`. Atualização segura.

## [1.3.0] - 2026

### Adicionado
- Logos de tecnologias (categoria Tecnologias).

## [1.2.0] - 2026

### Corrigido
- Plugin Nuxt.
### Adicionado
- Herança de cor e tamanho (`currentColor` / `1em`).

## [1.1.0] - 2026

### Adicionado
- Ícones `github` e `npm` (categoria Tecnologias).

## [1.0.0] - 2026

### Adicionado
- Versão inicial da biblioteca `@edusites/icons`.
