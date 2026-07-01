# Changelog

Todas as mudanças relevantes deste projeto são documentadas aqui.
O formato segue o [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/)
e o projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

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
