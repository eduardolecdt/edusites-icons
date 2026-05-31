import { defineComponent, computed, h } from 'vue'
import { svgIcone } from './core.js'

export default defineComponent({
  name: 'SvgIcone',
  props: {
    nome: { type: String, required: true },
    cor: { type: String, default: undefined },
    tamanho: { type: [Number, String], default: undefined },
    className: { type: String, default: undefined }
  },
  setup(props) {
    // computed = memoizado pelo Vue; só recalcula se uma prop mudar
    const svg = computed(() =>
      svgIcone({
        nome: props.nome,
        cor: props.cor,
        tamanho: props.tamanho ? Number(props.tamanho) : undefined,
        className: props.className
      }) || ''
    )

    return () => h('span', { class: 'edusites-icone', style: 'display:inline-flex;line-height:0', innerHTML: svg.value })
  }
})
