import { defineComponent, ref, watchEffect, h } from 'vue'
import { svgIconeAsync } from './render.js'

export default defineComponent({
  name: 'SvgIcone',
  props: {
    nome: { type: String, required: true },
    // Sem cor → herda do CSS (fill: currentColor). Passe uma cor para fixar.
    cor: { type: String, default: 'currentColor' },
    // Sem tamanho → herda do CSS (1em, escala com font-size). Passe número/px para fixar.
    tamanho: { type: [Number, String], default: undefined },
    className: { type: String, default: undefined }
  },
  setup(props) {
    // O SVG bruto chega de forma assíncrona (chunk sob demanda no Vite).
    // Começa vazio e é preenchido quando o ícone resolve.
    const svg = ref('')

    // Tamanho usado no placeholder, pra reservar o espaço e evitar layout shift.
    const tamanhoPlaceholder = () => (props.tamanho == null ? '1em' : String(props.tamanho))

    watchEffect(async () => {
      const nome = props.nome
      const cor = props.cor
      const tamanho = props.tamanho == null ? '1em' : props.tamanho
      const className = props.className

      const resultado = await svgIconeAsync({ nome, cor, tamanho, className })

      // Se as props mudaram enquanto carregava, este efeito já foi reexecutado;
      // só aplicamos se ainda estivermos resolvendo o mesmo ícone.
      if (props.nome === nome) {
        svg.value = resultado || ''
      }
    })

    return () => {
      // Placeholder: span do mesmo tamanho enquanto o SVG não chegou (1 frame no
      // Vite), evitando layout shift. Depois trocamos pelo SVG real.
      if (!svg.value) {
        const t = tamanhoPlaceholder()
        return h('span', {
          class: 'edusites-icone',
          style: `display:inline-flex;line-height:0;width:${t};height:${t}`
        })
      }
      return h('span', {
        class: 'edusites-icone',
        style: 'display:inline-flex;line-height:0',
        innerHTML: svg.value
      })
    }
  }
})
