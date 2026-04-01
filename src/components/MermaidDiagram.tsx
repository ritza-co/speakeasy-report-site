import { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'

interface MermaidDiagramProps {
  chart: string
}

let idCounter = 0

export default function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [svg, setSvg] = useState<string>('')
  const [id] = useState(() => `mermaid-${++idCounter}`)

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: document.documentElement.classList.contains('dark') ? 'dark' : 'neutral',
      themeVariables: {
        primaryColor: '#c83228',
        primaryTextColor: '#1a1a1a',
        primaryBorderColor: '#c83228',
        lineColor: '#78716c',
        secondaryColor: '#fafafa',
        tertiaryColor: '#fafafa',
      },
      flowchart: {
        curve: 'basis',
        padding: 20,
      },
    })

    mermaid.render(id, chart).then(({ svg: rendered }) => {
      setSvg(rendered)
    })
  }, [chart, id])

  return (
    <div
      ref={ref}
      className="my-6 overflow-x-auto rounded border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 flex justify-center"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
