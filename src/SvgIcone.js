import { defineComponent, ref, watchEffect, h } from 'vue'
import { svgIcone, svgIconeAsync } from './render.js'

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
    const opcoes = () => ({
      nome: props.nome,
      cor: props.cor,
      tamanho: props.tamanho == null ? '1em' : props.tamanho,
      className: props.className
    })

    // Tenta resolver SÍNCRONO já na criação. No SSR (e no cliente quando o ícone
    // já está em cache — ex: veio do SSR), isso retorna o SVG na hora, então o
    // ícone entra no HTML renderizado pelo servidor (bom pra SEO, sem flash).
    const svg = ref(svgIcone(opcoes()) || '')

    // Dimensão CSS do placeholder: número vira px; string (ex: '1em', '20px')
    // é usada como está. Reserva o espaço pra evitar layout shift.
    const dimensaoPlaceholder = () => {
      const t = props.tamanho
      if (t == null) return '1em'
      return typeof t === 'number' || /^\d+$/.test(String(t)) ? `${t}px` : String(t)
    }

    // No cliente, se o síncrono não resolveu (ícone ainda não baixado) ou as props
    // mudaram, resolve sob demanda via chunk lazy e atualiza reativamente.
    watchEffect(async () => {
      const { nome } = opcoes()
      const sincrono = svgIcone(opcoes())
      if (sincrono) {
        svg.value = sincrono
        return
      }
      const resultado = await svgIconeAsync(opcoes())
      // Só aplica se ainda estivermos resolvendo o mesmo ícone (evita race).
      if (props.nome === nome) svg.value = resultado || ''
    })

    return () => {
      // Wrapper com dimensão fixa em AMBOS os estados (placeholder e resolvido).
      // Manter o mesmo style base evita mismatch de hidratação: o SSR pode ter
      // resolvido o SVG síncrono enquanto o cliente ainda mostra o placeholder no
      // primeiro paint — se os styles divergissem, o Vue acusaria hydration mismatch.
      const d = dimensaoPlaceholder()
      const style = `display:inline-flex;line-height:0;width:${d};height:${d}`

      // Placeholder do mesmo tamanho enquanto o SVG não chegou (evita layout shift).
      if (!svg.value) {
        return h('span', {
          class: 'edusites-icone',
          style
        })
      }
      return h('span', {
        class: 'edusites-icone',
        style,
        innerHTML: svg.value
      })
    }
  }
})
