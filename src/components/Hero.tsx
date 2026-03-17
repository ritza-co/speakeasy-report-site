import { motion } from 'framer-motion'

export default function Hero() {
  const enter = () =>
    document.getElementById('the-question')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden dot-grid bg-parchment dark:bg-black">

      {/* Speakeasy rainbow stripe — top of page */}
      <div className="sp-rainbow absolute top-0 left-0 right-0 h-[3px]" />

      {/* Orbit rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[520px] h-[520px] rounded-full border border-stone-300/60 dark:border-stone-850/70" />
        <div className="absolute w-[360px] h-[360px] rounded-full border border-stone-300/50 dark:border-stone-850/60" />
        <div className="absolute w-[200px] h-[200px] rounded-full border border-stone-300/40 dark:border-stone-850/50" />
      </div>

      {/* Orbital particles */}
      <div className="orbit-anchor pointer-events-none">
        <div className="particle particle-1" />
        <div className="particle particle-2" />
        <div className="particle particle-3" />
      </div>

      {/* Center content */}
      <div className="relative z-10 text-center max-w-2xl px-6">
        <motion.p
          className="text-[10px] tracking-[0.35em] uppercase text-stone-400 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.9 }}
        >
          Speakeasy · API Integration Benchmark · 2025
        </motion.p>

        <motion.h1
          className="font-serif text-[clamp(2.6rem,5vw,4.2rem)] text-ink dark:text-white leading-[1.12] mb-5"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 1 }}
        >
          Do Agents <em>Actually</em><br />Need Help?
        </motion.h1>

        <motion.p
          className="font-serif italic text-stone-500 text-[1.15rem] mb-12 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.9 }}
        >
          SDKs, MCPs, and the anatomy of 108 integration attempts
          <br />across Resend, Linear and Metabase.
        </motion.p>

        <motion.button
          onClick={enter}
          className="border border-ink/25 dark:border-white/20 text-ink/55 dark:text-white/50 text-[10px] tracking-[0.25em] uppercase px-12 py-3.5 hover:border-ink/50 dark:hover:border-white/40 hover:text-ink/80 dark:hover:text-white/80 transition-all duration-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.35, duration: 0.7 }}
        >
          Enter
        </motion.button>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.7 }}
      >
        <span className="text-[9px] tracking-[0.35em] uppercase text-stone-400">
          Scroll down
        </span>
        <div className="bounce-arrow text-stone-400">
          <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
            <line x1="5" y1="0" x2="5" y2="14" stroke="currentColor" strokeWidth="1.2" />
            <polyline points="1,10 5,15 9,10" fill="none" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </div>
      </motion.div>
    </div>
  )
}
