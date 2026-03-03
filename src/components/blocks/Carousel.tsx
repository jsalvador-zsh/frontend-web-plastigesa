'use client'

import { useRef } from 'react'
import { motion, useInView } from 'motion/react'
import type { BlockCarousel } from '@/types/strapi'
import { getStrapiMedia } from '@/lib/strapi'
import Image from 'next/image'
import { Marquee } from '@/components/magicui/marquee'

interface CarouselBlockProps extends BlockCarousel {
  rows?: number
  directions?: ('left' | 'right')[]
  speeds?: number[]
}

export function MultiRowCarouselBlock({
  images,
  rows = 2,
  directions = ['left', 'right'],
}: CarouselBlockProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-40px 0px' })

  // Split imágenes para dos filas
  const half = Math.ceil(images.length / 2)
  const firstRow = images.length > 1 ? images.slice(0, half) : images
  const secondRow = images.length > 1 ? images.slice(half) : images

  const rowImages = [firstRow, secondRow]

  return (
    <motion.div
      ref={ref}
      className="relative max-w-6xl mx-auto px-4 space-y-4 overflow-hidden py-4"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
    >
      {Array.from({ length: Math.min(rows, 2) }).map((_, rowIndex) => {
        const isReverse = directions[rowIndex % directions.length] === 'right'
        const rowImgs = rowImages[rowIndex] ?? firstRow

        return (
          <Marquee
            key={rowIndex}
            reverse={isReverse}
            pauseOnHover
            className="[--duration:35s]"
          >
            {rowImgs.map((img) => (
              <LogoItem key={img.id} img={img} />
            ))}
          </Marquee>
        )
      })}

      {/* Fade lateral izquierda */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background" />
      {/* Fade lateral derecha */}
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background" />
    </motion.div>
  )
}

function LogoItem({ img }: { img: BlockCarousel['images'][0] }) {
  return (
    <motion.div
      className="relative flex-shrink-0 flex justify-center items-center h-14 w-32 mx-6"
      whileHover={{ scale: 1.1, filter: 'grayscale(0%) opacity(100%)' }}
      style={{ filter: 'grayscale(100%) opacity(60%)' }}
      transition={{ duration: 0.25 }}
    >
      <Image
        src={getStrapiMedia(img.url) ?? ''}
        alt={img.alternativeText ?? 'Logo'}
        fill
        className="object-contain"
        sizes="128px"
      />
    </motion.div>
  )
}
