'use client'

import { useRef } from 'react'
import { motion, useInView } from 'motion/react'
import { BlockSectionHeader } from '@/types/strapi'

export default function SectionHeader(props: BlockSectionHeader) {
  const { id, heading, subheading, badge, anchorLink } = props
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px 0px' })

  return (
    <section
      ref={ref}
      id={anchorLink?.href ?? ''}
      key={id}
      className="py-16 text-center"
    >
      <div className="container mx-auto px-6 max-w-4xl space-y-4">

        {/* Badge */}
        {badge && (
          <motion.span
            className="inline-block text-xs uppercase tracking-[0.2em] text-green-600 font-bold"
            initial={{ opacity: 0, y: 10, scale: 0.92 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            {badge}
          </motion.span>
        )}

        {/* Heading con clip-path wipe */}
        <div className="overflow-hidden">
          <motion.h2
            className="text-4xl md:text-5xl font-bold tracking-tight"
            initial={{ opacity: 0, y: '100%' }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            {heading}
          </motion.h2>
        </div>

        {/* Línea decorativa animada */}
        <motion.div
          className="mx-auto h-1 rounded-full bg-gradient-to-r from-green-500 to-emerald-400"
          initial={{ width: 0, opacity: 0 }}
          animate={isInView ? { width: 64, opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.35, ease: 'easeOut' }}
        />

        {/* Subheading */}
        {subheading && (
          <motion.p
            className="text-lg text-muted-foreground whitespace-pre-line max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.45, ease: 'easeOut' }}
          >
            {subheading}
          </motion.p>
        )}
      </div>
    </section>
  )
}
