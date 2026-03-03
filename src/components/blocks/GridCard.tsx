'use client'

import { useRef } from 'react'
import { motion, useInView } from 'motion/react'
import { BlockGridCard } from '@/types/strapi'
import { LucideIcon, Zap, Users, Award, TrendingUp, Star, Shield } from 'lucide-react'
import { NumberTicker } from '@/components/magicui/number-ticker'

const iconMap: Record<string, LucideIcon> = {
    zap: Zap,
    users: Users,
    award: Award,
    trending: TrendingUp,
    star: Star,
    shield: Shield,
}

export default function GridCard(props: BlockGridCard) {
    const { id, cards } = props
    const ref = useRef<HTMLElement>(null)
    const isInView = useInView(ref, { once: true, margin: '-60px 0px' })

    return (
        <section ref={ref} key={id} className="py-16">
            <div className="container mx-auto px-6 max-w-6xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {cards.map((card, i) => {
                    const Icon = iconMap[card.icon] || Zap
                    return (
                        <motion.div
                            key={card.id}
                            initial={{ opacity: 0, y: 32 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{
                                delay: i * 0.12,
                                duration: 0.6,
                                ease: [0.16, 1, 0.3, 1],
                            }}
                        >
                            <motion.div
                                className="group relative p-8 rounded-2xl border border-border/60 bg-card text-center space-y-3 cursor-default overflow-hidden hover:shadow-2xl dark:hover:shadow-green-900/20 transition-all duration-400"
                                whileHover={{ y: -6 }}
                                transition={{ duration: 0.3, ease: 'easeOut' }}
                            >
                                {/* Fondo hover glow */}
                                <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-0 rounded-2xl" />

                                <div className="relative z-10 space-y-3">
                                    {/* Icono */}
                                    <motion.div
                                        className="mx-auto w-14 h-14 rounded-xl bg-green-50 dark:bg-green-950/50 flex items-center justify-center text-green-600 dark:text-green-500 group-hover:bg-green-100 dark:group-hover:bg-green-900/60 transition-colors duration-300"
                                        whileHover={{ rotate: [0, -8, 8, 0] }}
                                        transition={{ duration: 0.4 }}
                                    >
                                        <Icon className="size-7" />
                                    </motion.div>

                                    {/* Número */}
                                    <div className="flex items-end justify-center gap-0.5">
                                        <NumberTicker
                                            value={card.number}
                                            className="text-5xl font-bold text-foreground tabular-nums"
                                        />
                                        <span className="text-4xl font-bold text-green-600 pb-0.5">+</span>
                                    </div>

                                    {/* Texto */}
                                    <p className="text-muted-foreground text-sm font-medium leading-snug">
                                        {card.text}
                                    </p>
                                </div>
                            </motion.div>
                        </motion.div>
                    )
                })}
            </div>
        </section>
    )
}
