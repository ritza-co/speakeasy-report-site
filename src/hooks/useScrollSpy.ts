import { useState, useEffect } from 'react'

export function useScrollSpy(ids: string[]) {
  const [activeId, setActiveId] = useState(ids[0] ?? '')

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY + window.innerHeight * 0.35
      for (let i = ids.length - 1; i >= 0; i--) {
        const el = document.getElementById(ids[i])
        if (el && el.offsetTop <= scrollY) {
          setActiveId(ids[i])
          return
        }
      }
      setActiveId(ids[0])
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [ids])

  return activeId
}
