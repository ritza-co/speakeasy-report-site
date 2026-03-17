import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface SectionProps {
  id: string
  chapterLabel: string
  headline: string
  subheadline?: string
  children: ReactNode
}

export default function Section({ id, chapterLabel, headline, subheadline, children }: SectionProps) {
  const words = headline.split(' ')

  return (
    <section id={id} className="pt-24 pb-16">
      {/* Chapter label */}
      <motion.p
        className="text-[10px] tracking-[0.35em] uppercase text-crimson font-sans mb-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5 }}
      >
        {chapterLabel}
      </motion.p>

      {/* Headline — word by word */}
      <h2 className="font-serif text-[clamp(2rem,3.5vw,3rem)] text-ink dark:text-white leading-[1.15] mb-4">
        {words.map((word, i) => (
          <motion.span
            key={i}
            className="inline-block"
            style={{ marginRight: '0.28em' }}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.45, delay: 0.05 + i * 0.065, ease: 'easeOut' }}
          >
            {word}
          </motion.span>
        ))}
      </h2>

      {subheadline && (
        <motion.p
          className="font-serif italic text-stone-500 text-lg mb-8 leading-relaxed max-w-xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {subheadline}
        </motion.p>
      )}

      {/* Divider line — draws in */}
      <motion.div
        className="h-[1px] bg-crimson mb-10"
        initial={{ width: 0 }}
        whileInView={{ width: 48 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5, delay: 0.4, ease: 'easeOut' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    </section>
  )
}
