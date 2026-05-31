# Contribuindo

Obrigado por considerar contribuir com `@edusites/icons`!

## Como Contribuir

### Adicionar Novo Ícone

1. Adicione o SVG em `src/icones.js`:

   - Nome em lowercase e kebab-case (ex: `seta-direita`)
   - ViewBox: `0 0 24 24` (recomendado)
   - NÃO defina `fill` nos paths — a cor é injetada pela lib (ícone preto por padrão, customizável via `cor`)

```javascript
export const ICONES = {
  // ...
  'novo-icone': `<svg viewBox="0 0 24 24"><path d="..."/></svg>`
}
```

2. Atualize a lista de ícones no README.md

### Pull Request

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/novo-icone`
3. Commit: `git commit -m 'feat: adiciona ícone XYZ'`
4. Push: `git push origin feature/novo-icone`
5. Abra um Pull Request

## Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob MIT License.
