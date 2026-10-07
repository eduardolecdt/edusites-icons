# Contribuindo

Obrigado por considerar contribuir com `@edusites/icons`!

## Como Contribuir

### Adicionar um Novo Ícone

Cada ícone é um arquivo individual em `src/icones/` (isso é o que permite o
_tree-shaking_ — apps só baixam os ícones que usam). Para adicionar um ícone:

1. **Crie o arquivo** `src/icones/<nome>.js`:

   - Nome em minúsculas e kebab-case (ex: `seta-direita`).
   - `viewBox="0 0 100 100"` (padrão da lib; o desenho fica centralizado num canvas quadrado).
   - **NÃO** defina `fill`, `width` ou `height` — a cor e o tamanho são injetados em runtime.
   - **NÃO** use `stroke` com cor fixa nem partes semi-transparentes (`opacity`, `#rrggbbaa`); o ícone deve ser 100% sólido e herdar a cor.
   - **Exceção: conjunto `gestao-dev` (ícones em camadas, desde a 1.9.0).** Esses
     usam gradiente com `stop-color="currentColor"`, máscara de recortes e o
     marcador `__ID__` em todos os ids — o render troca o marcador por um id
     único a cada uso. Não crie ícone em camadas à mão: siga o mesmo motor
     (face 100→45%, vidro 60→18%, base 45→8% deslocada 3px, recortes por máscara).
   - **Exceção: conjunto `encarafit` (ícones de traço, desde a 1.11.0).** O
     desenho é linha, não área. A **raiz** do SVG declara a pintura inteira —
     `fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
     stroke-linejoin="round"` — e os elementos internos não repetem isso. Mantenha
     o `viewBox="0 0 24 24"` da grade original (os 2px de respiro fazem parte do
     desenho). Pontos pequenos são a única parte cheia: `<circle ... fill="currentColor"
     stroke="none"/>`. O render detecta o traço pelo `stroke` na tag raiz, mantém
     os `fill` internos, copia `stroke-width`/`stroke-linecap`/`stroke-linejoin`
     para a raiz final e manda a cor pedida para `color` (o traço usa
     `currentColor`). Não converta o traço em contorno nem mude a espessura: para
     outro tamanho, o ícone inteiro escala. Nomes com prefixo `ef-`.

   ```javascript
   export default `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="..."/></svg>`
   ```

2. **Adicione a entrada no `src/icones.js`** (o objeto monolítico, usado como
   fallback no servidor) com o mesmo conteúdo:

   ```javascript
   export const ICONES = {
     // ...
     'novo-icone': `<svg viewBox="0 0 100 100" ...>...</svg>`
   }
   ```

3. **Adicione os metadados no `src/meta.js`** — todos os campos são obrigatórios:

   ```javascript
   'novo-icone': {
     categoria: 'Interface',                    // uma das categorias em CATEGORIAS
     palavras: ['novo', 'exemplo', 'sinonimo'], // termos de busca
     descricao: 'Descrição visual detalhada do desenho, em pt-BR, para busca e IA.',
     versao: '1.5.0'                            // versão em que o ícone entrou
   }
   ```

   A `descricao` deve descrever a **aparência** (forma, contorno/preenchido,
   elementos internos, o que representa) — é o que permite que uma IA escolha o
   ícone certo sem ver a imagem. Veja exemplos no próprio `meta.js`.

### Logos de Marcas

Ícones que são logotipos de marcas devem ter `marca: true` no `meta.js`. Veja a
seção **Marcas e trademark** no README.

### Pull Request

1. Faça um fork do projeto.
2. Crie uma branch: `git checkout -b feat/novo-icone`.
3. Rode a validação: `node --check src/meta.js && node --check src/icones.js`.
4. Commit seguindo [Conventional Commits](https://www.conventionalcommits.org/):
   `git commit -m 'feat: adiciona ícone novo-icone'`.
5. Push: `git push origin feat/novo-icone`.
6. Abra um Pull Request descrevendo o ícone adicionado.

## Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob a
licença MIT.
