'use client'

import { useRef } from 'react'
import { motion, useInView } from 'motion/react'
import type { BlockCtaBanner } from '@/types/strapi'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export default function CtaBanner({
  heading,
  text,
  primaryLink,
  secondaryLink,
  backgroundStyle,
}: BlockCtaBanner) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px 0px' })

  const isGradient = backgroundStyle === 'gradient'
  const isPrimary = backgroundStyle === 'primary'
  const isLight = backgroundStyle === 'default'

  const bgClass = isGradient
    ? 'bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 text-white'
    : isPrimary
      ? 'bg-primary text-primary-foreground'
      : 'bg-muted'

  return (
    <section ref={ref} className={cn('relative py-24 overflow-hidden', bgClass)}>

      {/* Grain texture (solo en gradiente / primary) */}
      {(isGradient || isPrimary) && (
        <div
          className="absolute inset-0 opacity-[0.12] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundSize: '150px 150px',
          }}
        />
      )}

      {/* Orbs decorativos (solo gradiente) */}
      {isGradient && (
        <>
          <div className="absolute top-0 left-1/4 w-80 h-80 rounded-full bg-white/10 blur-3xl -translate-y-1/2 pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-teal-400/20 blur-3xl translate-y-1/3 pointer-events-none" />
        </>
      )}

      <div className="container mx-auto px-6 max-w-4xl text-center relative z-10 space-y-6">

        {/* Heading */}
        <div className="overflow-hidden">
          <motion.h2
            className="text-3xl md:text-5xl font-bold tracking-tight"
            initial={{ opacity: 0, y: '100%' }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            {heading}
          </motion.h2>
        </div>

        {/* Texto */}
        {text && (
          <motion.p
            className={cn('text-lg max-w-2xl mx-auto', isLight ? 'text-muted-foreground' : 'opacity-85')}
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.2 }}
          >
            {text}
          </motion.p>
        )}

        {/* Botones */}
        {(primaryLink || secondaryLink) && (
          <motion.div
            className="flex flex-wrap gap-4 justify-center pt-2"
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.35 }}
          >
            {primaryLink && (
              <Link
                href={primaryLink.href}
                target={primaryLink.isExternal ? '_blank' : '_self'}
                rel={primaryLink.isExternal ? 'noopener noreferrer' : undefined}
              >
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className={cn(
                    'relative overflow-hidden px-7 py-3 rounded-lg font-semibold text-sm transition-colors',
                    isLight
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'bg-white text-green-700 hover:bg-white/90 shadow-lg'
                  )}
                >
                  {/* Shimmer */}
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
                  {primaryLink.label}
                </motion.button>
              </Link>
            )}

            {secondaryLink && (
              <Link
                href={secondaryLink.href}
                target={secondaryLink.isExternal ? '_blank' : '_self'}
                rel={secondaryLink.isExternal ? 'noopener noreferrer' : undefined}
              >
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className={cn(
                    'relative px-7 py-3 rounded-lg font-semibold text-sm border-2 transition-colors',
                    isLight
                      ? 'border-border text-foreground hover:bg-muted'
                      : 'border-white/60 text-white hover:bg-white/10'
                  )}
                >
                  {secondaryLink.label}
                </motion.button>
              </Link>
            )}
          </motion.div>
        )}
      </div>
    </section>
  )
}
