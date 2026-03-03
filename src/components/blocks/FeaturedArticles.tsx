'use client'

import { useRef } from 'react'
import { motion, useInView } from 'motion/react'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CalendarDays, Clock, ArrowUpRight } from 'lucide-react'
import type { BlockFeaturedArticles } from '@/types/strapi'
import Link from 'next/link'
import Image from 'next/image'
import { getStrapiMedia } from '@/lib/strapi'

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

export default function FeaturedArticles({ articles }: BlockFeaturedArticles) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px 0px' })

  return (
    <section ref={ref} className="max-w-6xl mx-auto px-6 py-8">
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article, i) => (
          <ArticleCard key={article.id} article={article} index={i} isInView={isInView} />
        ))}
      </div>
    </section>
  )
}

function ArticleCard({
  article,
  index,
  isInView,
}: {
  article: BlockFeaturedArticles['articles'][0]
  index: number
  isInView: boolean
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        delay: index * 0.1,
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      }}
    >
      <Link href={`/blog/${article.slug}`} className="group block h-full">
        <motion.div
          className="flex flex-col h-full rounded-2xl border border-border/60 bg-card overflow-hidden hover:shadow-xl dark:hover:shadow-green-900/20 transition-all duration-400"
          whileHover={{ y: -4 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          {/* Imagen */}
          <div className="relative aspect-video overflow-hidden">
            <motion.div
              className="absolute inset-0"
              whileHover={{ scale: 1.06 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <Image
                src={getStrapiMedia(article.featuredImage?.url)}
                alt={article.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </motion.div>
            {/* Overlay en hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

            {/* Tags flotantes */}
            {article.contentTags?.length > 0 && (
              <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                {article.contentTags.slice(0, 2).map((tag) => (
                  <Badge
                    key={tag.id}
                    className="bg-black/50 text-white backdrop-blur-sm border-0 text-xs px-2 py-0.5"
                  >
                    {tag.title}
                  </Badge>
                ))}
              </div>
            )}

            {/* Tiempo de lectura */}
            <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm">
              <Clock className="h-3 w-3" />
              {article.time} min
            </div>
          </div>

          {/* Contenido */}
          <div className="flex flex-col flex-1 p-5 space-y-3">
            <h3 className="font-bold text-lg leading-snug text-foreground group-hover:text-green-700 transition-colors duration-200 line-clamp-2 text-balance">
              {article.title}
            </h3>

            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 flex-1">
              {article.description}
            </p>

            {/* Separador */}
            <div className="h-px bg-border/60" />

            {/* Bottom row */}
            <div className="flex items-center justify-between pt-1">
              {/* Autor */}
              <div className="flex items-center gap-2">
                <Avatar className="size-7 ring-2 ring-green-100 ring-offset-1">
                  <AvatarImage
                    src={getStrapiMedia(article.author?.image?.url)}
                    alt={article.author?.fullName}
                  />
                  <AvatarFallback className="text-[10px] bg-green-50 text-green-700 font-semibold">
                    {getInitials(article.author.fullName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-xs font-semibold leading-tight">{article.author.fullName}</p>
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <CalendarDays className="h-2.5 w-2.5" />
                    {article.date}
                  </div>
                </div>
              </div>

              {/* CTA icon */}
              <motion.div
                className="flex h-8 w-8 items-center justify-center rounded-full bg-green-50 text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors duration-200"
                whileHover={{ rotate: 45 }}
                transition={{ duration: 0.2 }}
              >
                <ArrowUpRight className="h-4 w-4" />
              </motion.div>
            </div>
          </div>

          {/* Borde inferior animado */}
          <motion.div
            className="h-0.5 bg-gradient-to-r from-green-500 to-emerald-400"
            initial={{ scaleX: 0, originX: 0 }}
            whileHover={{ scaleX: 1 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </motion.div>
      </Link>
    </motion.article>
  )
}
