import { useRef, useState, useEffect } from 'react'
import { useInView } from 'framer-motion'

interface CountUpProps {
  to: number
  decimals?: number
  prefix?: string
  suffix?: string
  duration?: number
  className?: string
}

export function CountUp({
  to, decimals = 0, prefix = '', suffix = '', duration = 1100, className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  const [val, setVal] = useState(0)

  useEffect(() => {
    if (!isInView) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVal(to)
      return
    }

    const start = performance.now()
    let raf: number

    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // cubic ease-out
      setVal(eased * to)
      if (progress < 1) {
        raf = requestAnimationFrame(step)
      } else {
        setVal(to)
      }
    }

    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [isInView, to, duration])

  return (
    <span ref={ref} className={className}>
      {prefix}{val.toFixed(decimals)}{suffix}
    </span>
  )
}
