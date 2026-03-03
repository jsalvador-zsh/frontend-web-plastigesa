'use client'

import { useRef } from 'react'
import { motion, useInView } from 'motion/react'
import type { BlockTestimonials } from '@/types/strapi'
import { getStrapiMedia } from '@/lib/strapi'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Star, Quote } from 'lucide-react'
import { Marquee } from '@/components/magicui/marquee'

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${i < rating ? 'fill-amber-400 text-amber-400' : 'fill-muted text-muted'
            }`}
        />
      ))}
    </div>
  )
}

function TestimonialCard({ item }: { item: BlockTestimonials['testimonials'][0] }) {
  return (
    <motion.div
      className="relative w-72 shrink-0 mx-3 p-6 rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm space-y-4 cursor-default overflow-hidden group hover:shadow-xl dark:hover:shadow-green-900/20 transition-all duration-400"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      {/* Icono de cita decorativo */}
      <Quote className="absolute top-4 right-5 size-8 text-green-100 group-hover:text-green-200 transition-colors duration-300" />

      <StarRating rating={item.rating} />

      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4 relative z-10">
        &ldquo;{item.quote}&rdquo;
      </p>

      {/* Separador */}
      <div className="h-px bg-border/60" />

      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9 ring-2 ring-green-100 ring-offset-1">
          <AvatarImage
            src={getStrapiMedia(item.avatar?.url)}
            alt={item.name}
          />
          <AvatarFallback className="text-xs bg-green-50 text-green-700 font-semibold">
            {getInitials(item.name)}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-semibold leading-tight">{item.name}</p>
          <p className="text-xs text-muted-foreground leading-tight mt-0.5">
            {item.role}{item.company ? ` · ${item.company}` : ''}
          </p>
        </div>
      </div>

      {/* Borde verde inferior en hover */}
      <motion.div
        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-green-400 to-emerald-400 rounded-b-2xl"
        initial={{ width: '0%' }}
        whileHover={{ width: '100%' }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  )
}

export default function TestimonialsBlock({
  heading,
  subheading,
  testimonials,
}: BlockTestimonials) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px 0px' })

  if (!testimonials?.length) return null

  const half = Math.ceil(testimonials.length / 2)
  const firstRow = testimonials.slice(0, half)
  const secondRow = testimonials.slice(half)

  return (
    <section ref={ref} className="py-20 overflow-hidden">

      {/* Header */}
      <div className="container mx-auto px-6 max-w-4xl text-center mb-14 space-y-3">
        <div className="overflow-hidden">
          <motion.h2
            className="text-3xl md:text-4xl font-bold tracking-tight"
            initial={{ opacity: 0, y: '100%' }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          >
            {heading}
          </motion.h2>
        </div>
        {subheading && (
          <motion.p
            className="text-muted-foreground text-lg max-w-xl mx-auto"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {subheading}
          </motion.p>
        )}
      </div>

      {/* Marquee rows */}
      <div className="space-y-5">
        <Marquee pauseOnHover className="[--duration:45s]">
          {firstRow.map((item) => (
            <TestimonialCard key={item.id} item={item} />
          ))}
        </Marquee>
        {secondRow.length > 0 && (
          <Marquee reverse pauseOnHover className="[--duration:45s]">
            {secondRow.map((item) => (
              <TestimonialCard key={item.id} item={item} />
            ))}
          </Marquee>
        )}
      </div>
    </section>
  )
}
