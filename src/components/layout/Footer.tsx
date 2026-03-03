'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView } from 'motion/react'
import { getSocialIcon } from '@/lib/getSocialIcon'
import { getStrapiMedia } from '@/lib/strapi'
import type { Footer as FooterType } from '@/types/strapi'

interface FooterProps {
    data: FooterType
}

const Footer = ({ data }: FooterProps) => {
    const { logo, navitems, socialitems, text } = data
    const ref = useRef<HTMLElement>(null)
    const isInView = useInView(ref, { once: true, margin: '-60px 0px' })

    const legalLinks = navitems.filter((item) => item.isVisible)
    const socialLinks = socialitems.filter((item) => item.hasIcon)

    return (
        <footer
            ref={ref}
            className="relative bg-neutral-950 dark:bg-black text-white overflow-hidden mt-0 border-t border-border"
        >
            {/* Borde superior redondeado */}
            <div className="absolute top-0 left-0 right-0 h-6 bg-background rounded-b-[2rem] -translate-y-px" />

            {/* Grain sutil */}
            <div
                className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                    backgroundSize: '120px 120px',
                }}
            />

            <div className="container mx-auto px-6 max-w-6xl pt-16 pb-8 relative z-10">

                {/* Cuerpo principal */}
                <div className="flex flex-col lg:flex-row justify-between gap-12 mb-12">

                    {/* Marca */}
                    <motion.div
                        className="flex flex-col gap-5 max-w-sm"
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                    >
                        <Link href={logo.href} className="flex items-center gap-2.5 group">
                            {logo?.image?.url && (
                                <motion.div whileHover={{ rotate: -8, scale: 1.1 }} transition={{ duration: 0.3 }}>
                                    <Image
                                        src={getStrapiMedia(logo.image.url) ?? ''}
                                        alt={logo.image.alternativeText || logo.text}
                                        width={36}
                                        height={36}
                                        className="h-8 w-8 object-contain brightness-0 invert"
                                    />
                                </motion.div>
                            )}
                            <span className="text-lg font-bold text-white">{logo.text}</span>
                        </Link>

                        <p className="text-sm text-white/60 leading-relaxed">{text}</p>

                        {/* Social links */}
                        <ul className="flex items-center gap-3">
                            {socialLinks.map((item, i) => (
                                <motion.li
                                    key={item.id}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                                    transition={{ delay: 0.2 + i * 0.07, duration: 0.3 }}
                                >
                                    <motion.a
                                        href={item.href}
                                        target={item.isExternal ? '_blank' : '_self'}
                                        rel={item.isExternal ? 'noopener noreferrer' : undefined}
                                        aria-label={item.text}
                                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-colors duration-200"
                                        whileHover={{ scale: 1.1, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {getSocialIcon(item.icon)}
                                    </motion.a>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Navegación */}
                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 gap-10"
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                    >
                        <div>
                            <span className="text-sm font-semibold text-white mb-4 block tracking-wide uppercase">
                                Navegación
                            </span>
                            <ul className="space-y-2.5">
                                {legalLinks.map((link, i) => (
                                    <motion.li
                                        key={link.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                                        transition={{ delay: 0.25 + i * 0.06, duration: 0.4 }}
                                    >
                                        <Link
                                            href={link.href}
                                            target={link.isExternal ? '_blank' : '_self'}
                                            className="group text-sm text-white/55 hover:text-white transition-colors duration-200 flex items-center gap-2"
                                        >
                                            <motion.span
                                                className="inline-block w-0 h-px bg-green-400 group-hover:w-3 transition-all duration-200"
                                            />
                                            {link.label}
                                        </Link>
                                    </motion.li>
                                ))}
                            </ul>
                        </div>

                        {/* Indicador de sistema — "Status" */}
                        <div>
                        </div>
                    </motion.div>
                </div>

                {/* Separador elegante */}
                <div className="h-px bg-white/10 mb-6" />

                {/* Bottom bar */}
                <motion.div
                    className="flex flex-col sm:flex-row items-center justify-between gap-3"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.5, duration: 0.5 }}
                >
                    <p className="text-xs text-white/40">
                        © {new Date().getFullYear()} {logo.text}. Todos los derechos reservados.
                    </p>
                    <p className="text-xs text-white/30">
                        Hecho con ♥ en Arequipa, Perú
                    </p>
                </motion.div>
            </div>
        </footer>
    )
}

export default Footer
