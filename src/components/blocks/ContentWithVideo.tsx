'use client'

import { useRef } from 'react'
import { motion, useInView } from 'motion/react'
import { BlockContentWithVideo } from '@/types/strapi'
import { getStrapiMedia } from '@/lib/strapi'
import HeroVideoDialog from '@/components/magicui/hero-video-dialog'

interface Props extends BlockContentWithVideo { }

export default function ContentWithVideo({
  heading,
  text,
  reversed,
  videoUrl,
  thumbnail,
}: Props) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px 0px' })

  return (
    <section ref={ref} className="py-16 overflow-hidden">
      <div
        className={`container mx-auto px-6 max-w-6xl grid md:grid-cols-2 gap-12 lg:gap-20 items-center ${reversed ? 'md:[direction:rtl]' : ''
          }`}
      >
        {/* Texto */}
        <motion.div
          className="space-y-5 text-center md:text-left md:[direction:ltr]"
          initial={{ opacity: 0, x: reversed ? 24 : -24 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        >
          <h3 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight text-pretty">
            {heading}
          </h3>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            {text.map((block, index) =>
              block.type === 'paragraph' ? (
                <motion.p
                  key={index}
                  className="text-pretty"
                  initial={{ opacity: 0, y: 8 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.15 + index * 0.1, duration: 0.45 }}
                >
                  {block.children.map((c) => c.text).join('')}
                </motion.p>
              ) : null
            )}
          </div>

          {/* Acento */}
          <motion.div
            className="hidden md:block w-12 h-1 rounded-full bg-green-500"
            initial={{ width: 0 }}
            animate={isInView ? { width: 48 } : {}}
            transition={{ delay: 0.5, duration: 0.4 }}
          />
        </motion.div>

        {/* Video */}
        <motion.div
          className="relative md:[direction:ltr]"
          initial={{ opacity: 0, x: reversed ? -24 : 24, scale: 0.97 }}
          animate={isInView ? { opacity: 1, x: 0, scale: 1 } : {}}
          transition={{
            duration: 0.7,
            delay: 0.15,
            ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
          }}
        >
          {/* Marco decorativo */}
          <div
            className={`absolute -inset-3 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 -z-10 ${reversed ? '-rotate-1' : 'rotate-1'
              }`}
          />

          <HeroVideoDialog
            videoSrc={videoUrl}
            className="rounded-xl overflow-hidden shadow-xl"
            animationStyle="from-center"
            thumbnailSrc={getStrapiMedia(thumbnail?.url)}
            thumbnailAlt={heading ?? 'Video'}
          />
        </motion.div>
      </div>
    </section>
  )
}
