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
