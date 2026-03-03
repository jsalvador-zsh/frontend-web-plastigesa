'use client'

import { useRef } from 'react'
import { motion, useInView } from 'motion/react'
import Image from 'next/image'
import { BlockGridCardImage } from '@/types/strapi'
import { getStrapiMedia } from '@/lib/strapi'
import { Badge } from '@/components/ui/badge'

export default function GridCardImage(props: BlockGridCardImage) {
  const { id, cards } = props
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px 0px' })

  return (
    <section ref={ref} key={id} className="py-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {cards.slice(0, 8).map((card, i) => (
            <motion.article
              key={card.id}
              initial={{ opacity: 0, y: 28 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                delay: i * 0.08,
                duration: 0.55,
                ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
              }}
              className="group relative rounded-xl overflow-hidden shadow-sm hover:shadow-2xl dark:hover:shadow-green-900/20 hover:-translate-y-1 transition-all duration-400 bg-card border border-border/40 cursor-pointer"
            >
              {/* Imagen con zoom en hover */}
              {card.image && (
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <motion.div
                    className="absolute inset-0"
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  >
                    <Image
                      src={getStrapiMedia(card.image.url)}
                      alt={card.heading ?? 'Imagen'}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  </motion.div>

                  {/* Overlay gradient en hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Badge flotante */}
                  {card.badge && (
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-white/90 dark:bg-black/90 text-foreground dark:text-white text-xs backdrop-blur-sm border-0 shadow-sm dark:shadow-none">
                        {card.badge}
                      </Badge>
                    </div>
                  )}
                </div>
              )}

              {/* Contenido */}
              <div className="p-4 space-y-1.5">
                <h3 className="font-semibold text-foreground leading-snug group-hover:text-green-700 dark:group-hover:text-green-500 transition-colors duration-200">
                  {card.heading}
                </h3>
                {card.text && (
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                    {card.text}
                  </p>
                )}
              </div>

              {/* Borde inferior animado */}
              <motion.div
                className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-green-500 to-emerald-400"
                initial={{ width: '0%' }}
                whileHover={{ width: '100%' }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
