import { defineComponent, computed, h } from 'vue'
import { svgIcone } from './core.js'

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
    // computed = memoizado pelo Vue; só recalcula se uma prop mudar
    const svg = computed(() =>
      svgIcone({
        nome: props.nome,
        cor: props.cor,
        tamanho: props.tamanho == null ? '1em' : props.tamanho,
        className: props.className
      }) || ''
    )

    return () => h('span', { class: 'edusites-icone', style: 'display:inline-flex;line-height:0', innerHTML: svg.value })
  }
})
