'use client'

import { useRef, useState } from 'react'
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'motion/react'
import type { BlockBentoGridCard } from '@/types/strapi'
import { getStrapiMedia } from '@/lib/strapi'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'

type SizeCard = 'large' | 'wide' | 'medium' | 'small'

const sizeClasses: Record<SizeCard, string> = {
  large: 'md:col-span-2 md:row-span-2',
  wide: 'md:col-span-2 md:row-span-1',
  medium: 'md:col-span-1 md:row-span-2',
  small: 'md:col-span-1 md:row-span-1',
}

export default function BentoGridCard({ cards }: { cards: BlockBentoGridCard['cards'] }) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px 0px' })

  return (
    <section ref={ref} className="pb-16">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 auto-rows-[200px]">
          {cards.map((item, i) => (
            <motion.div
              key={item.id}
              className={sizeClasses[(item.sizeCard as SizeCard) ?? 'small']}
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
              transition={{
                delay: i * 0.07,
                duration: 0.55,
                ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
              }}
            >
              <SpotlightCard item={item} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Card individual con mouse spotlight ─────────────────────────── */
function SpotlightCard({ item }: { item: BlockBentoGridCard['cards'][0] }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springX = useSpring(mouseX, { damping: 20, stiffness: 200 })
  const springY = useSpring(mouseY, { damping: 20, stiffness: 200 })

  const spotlightX = useTransform(springX, (v) => `${v}px`)
  const spotlightY = useTransform(springY, (v) => `${v}px`)

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    mouseX.set(e.clientX - rect.left)
    mouseY.set(e.clientY - rect.top)
  }

  return (
    <div
      ref={cardRef}
      className="group relative w-full h-full rounded-xl overflow-hidden cursor-pointer"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Imagen de fondo */}
      <Image
        src={getStrapiMedia(item.image.url) || '/placeholder.png'}
        alt={item.image?.alternativeText || item.heading}
        fill
        className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 16vw"
      />

      {/* Gradient base */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

      {/* Mouse spotlight */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-xl transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: useTransform(
            [springX, springY],
            ([x, y]) =>
              `radial-gradient(280px circle at ${x}px ${y}px, rgba(255,255,255,0.08), transparent 70%)`
          ),
        }}
      />

      {/* Badge */}
      <div className="absolute top-3 left-3 z-10">
        <Badge className="bg-black/40 text-white backdrop-blur-md border border-white/20 text-xs">
          {item.badge}
        </Badge>
      </div>

      {/* Contenido — sube al hover */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 p-5 z-10 text-white"
        animate={{ y: isHovered ? 0 : 6 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        <h3 className="text-base font-bold leading-snug mb-1.5">{item.heading}</h3>
        <motion.p
          className="text-xs text-white/80 leading-relaxed line-clamp-3"
          animate={{ opacity: isHovered ? 1 : 0.7, y: isHovered ? 0 : 4 }}
          transition={{ duration: 0.25 }}
        >
          {item.text}
        </motion.p>
      </motion.div>

      {/* Borde verde en hover */}
      <motion.div
        className="absolute inset-0 rounded-xl ring-2 ring-green-400/0 pointer-events-none"
        animate={{ '--tw-ring-opacity': isHovered ? '0.5' : '0' } as Record<string, number | string>}
        style={{
          boxShadow: isHovered ? 'inset 0 0 0 2px rgba(74,222,128,0.4)' : 'inset 0 0 0 2px transparent',
          transition: 'box-shadow 0.25s ease',
        }}
      />
    </div>
  )
}
