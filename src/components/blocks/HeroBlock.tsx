'use client'

import { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import type { HeroBlock } from '@/types/strapi'
import { getStrapiMedia } from '@/lib/strapi'
import { Marquee } from '@/components/magicui/marquee'
import { WordRotate } from '@/components/magicui/word-rotate'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'

export default function HeroBlock(props: HeroBlock) {
  const { heading, span, text, images, links } = props

  const rotatingWords = span.flatMap((s) =>
    s.children.map((child) => child.text).filter(Boolean)
  )

  // Split heading en palabras para animar de a una
  const words = heading.trim().split(' ')

  return (
    <section className="relative w-full px-6 py-24 md:py-32 bg-background overflow-hidden">

      {/* Fondo decorativo radial */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/2 left-1/4 w-[600px] h-[600px] rounded-full bg-green-100/60 dark:bg-green-900/20 blur-[100px] -translate-y-1/2 -translate-x-1/2" />
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-emerald-50/80 dark:bg-emerald-900/20 blur-[80px]" />
      </div>

      <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-12">

        {/* ── Texto ──────────────────────────────────── */}
        <div className="w-full md:w-1/2 text-center md:text-left space-y-6">

          {/* Heading — cada palabra entra con stagger */}
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground leading-[1.05]">
            {words.map((word, i) => (
              <motion.span
                key={i}
                className="inline-block mr-[0.25em]"
                initial={{ opacity: 0, y: 40, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{
                  delay: 0.1 + i * 0.08,
                  duration: 0.6,
                  ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
                }}
              >
                {word}
              </motion.span>
            ))}
          </h1>

          {/* WordRotate — solo si hay palabras */}
          {rotatingWords.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + words.length * 0.08, duration: 0.5 }}
            >
              <WordRotate
                words={rotatingWords}
                duration={3000}
                className="text-3xl md:text-5xl font-extrabold text-green-600"
              />
            </motion.div>
          )}

          {/* Descripción */}
          {text && (
            <motion.p
              className="text-base md:text-lg text-muted-foreground text-pretty max-w-md"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.55 }}
            >
              {text}
            </motion.p>
          )}

          {/* Botones con efecto magnético */}
          <motion.div
            className="flex flex-wrap gap-4 justify-center md:justify-start pt-2"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.5 }}
          >
            {links.map((link, i) => (
              <MagneticButton key={link.id} href={link.href} isExternal={link.isExternal} isPrimary={link.type === 'primary'}>
                {link.label}
              </MagneticButton>
            ))}
          </motion.div>
        </div>

        {/* ── Marquee de imágenes ─────────────────── */}
        {images.length > 0 && (
          <motion.div
            className="relative w-full md:w-5/12 h-[420px] flex items-center justify-center overflow-hidden"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          >
            <div className="grid grid-cols-2 gap-4 items-center justify-items-center h-full w-full">
              <Marquee vertical pauseOnHover className="[--duration:60s]">
                {images.map((img) => (
                  <ImageCard key={img.id} img={img} />
                ))}
              </Marquee>
              <Marquee vertical reverse pauseOnHover className="[--duration:60s]">
                {images.map((img) => (
                  <ImageCard key={`r-${img.id}`} img={img} />
                ))}
              </Marquee>
            </div>

            {/* Gradients */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-background" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-background" />
          </motion.div>
        )}
      </div>
    </section>
  )
}

/* ── Imagen card ─────────────────────────────────────────────────── */
function ImageCard({ img }: { img: HeroBlock['images'][0] }) {
  return (
    <motion.figure
      className={cn(
        'relative h-40 w-36 sm:w-40 rounded-xl border p-2 mx-2 my-2 overflow-hidden',
        'border-gray-950/[.08] bg-white/60 backdrop-blur-sm',
        'dark:border-gray-50/[.1] dark:bg-gray-50/[.08]',
      )}
      whileHover={{ scale: 1.05, rotate: 1 }}
      transition={{ duration: 0.25 }}
    >
      <Image
        src={getStrapiMedia(img.url)}
        alt={img.alternativeText ?? ''}
        fill
        className="object-contain p-1"
        sizes="160px"
      />
    </motion.figure>
  )
}

/* ── Botón magnético ─────────────────────────────────────────────── */
function MagneticButton({
  href,
  isExternal,
  isPrimary,
  children,
}: {
  href: string
  isExternal?: boolean
  isPrimary: boolean
  children: React.ReactNode
}) {
  const ref = useRef<HTMLAnchorElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { damping: 15, stiffness: 150 })
  const springY = useSpring(mouseY, { damping: 15, stiffness: 150 })

  function handleMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    mouseX.set((e.clientX - cx) * 0.35)
    mouseY.set((e.clientY - cy) * 0.35)
  }

  function handleMouseLeave() {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <motion.a
      ref={ref}
      href={href}
      target={isExternal ? '_blank' : '_self'}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      whileTap={{ scale: 0.96 }}
      className={cn(
        'relative inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold text-sm overflow-hidden transition-colors duration-200',
        isPrimary
          ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20'
          : 'border-2 border-border text-foreground hover:bg-muted'
      )}
    >
      {/* Shimmer solo en primario */}
      {isPrimary && (
        <motion.span
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
          whileHover={{ translateX: '200%' }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </motion.a>
  )
}
