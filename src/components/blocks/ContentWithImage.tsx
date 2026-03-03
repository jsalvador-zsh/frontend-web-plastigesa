'use client'

import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'motion/react'
import { BlockContentWithImage } from '@/types/strapi'
import { getStrapiMedia } from '@/lib/strapi'
import Image from 'next/image'

interface Props extends BlockContentWithImage { }

export default function ContentWithImage({
  heading,
  text,
  reversed,
  image,
}: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px 0px' })

  // Parallax sutil en scroll
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const imageY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%'])

  const textVariants = {
    hidden: { opacity: 0, x: reversed ? 24 : -24 },
    visible: { opacity: 1, x: 0 },
  }

  const imageVariants = {
    hidden: { opacity: 0, x: reversed ? -24 : 24, scale: 0.97 },
    visible: { opacity: 1, x: 0, scale: 1 },
  }

  return (
    <section ref={sectionRef} className="py-16 overflow-hidden">
      <div
        className={`container mx-auto px-6 max-w-6xl grid md:grid-cols-2 gap-12 lg:gap-20 items-center ${reversed ? 'md:[direction:rtl]' : ''
          }`}
      >
        {/* Texto */}
        <motion.div
          className="space-y-5 text-center md:text-left md:[direction:ltr]"
          variants={textVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        >
          <h3 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight text-pretty">
            {heading}
          </h3>
          <div className="space-y-4 text-muted-foreground text-base leading-relaxed">
            {text.map((block, index) =>
              block.type === 'paragraph' ? (
                <motion.p
                  key={index}
                  className="text-pretty"
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.25 + index * 0.1, duration: 0.5 }}
                >
                  {block.children.map((c) => c.text).join('')}
                </motion.p>
              ) : null
            )}
          </div>
          {/* Acento decorativo */}
          <motion.div
            className="hidden md:block w-12 h-1 rounded-full bg-green-500"
            initial={{ width: 0 }}
            animate={isInView ? { width: 48 } : {}}
            transition={{ delay: 0.5, duration: 0.4 }}
          />
        </motion.div>

        {/* Imagen con parallax */}
        <motion.div
          ref={imageRef}
          className="relative md:[direction:ltr]"
          variants={imageVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        >
          {/* Marco decorativo detrás */}
          <div className={`absolute -inset-3 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 -z-10 ${reversed ? '-rotate-1' : 'rotate-1'}`} />

          <motion.div style={{ y: imageY }} className="relative">
            <Image
              src={getStrapiMedia(image?.url)}
              alt={image?.alternativeText ?? heading ?? 'Imagen'}
              width={600}
              height={400}
              className="w-full h-auto object-cover rounded-xl shadow-xl"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
