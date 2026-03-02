'use client'

import Image from 'next/image'
import Link from 'next/link'
import { getSocialIcon } from '@/lib/getSocialIcon'
import { getStrapiMedia } from '@/lib/strapi'
import type { Footer as FooterType } from '@/types/strapi'
import { Separator } from '@/components/ui/separator'

interface FooterProps {
    data: FooterType
}

const Footer = ({ data }: FooterProps) => {
    const { logo, navitems, socialitems, text } = data

    const legalLinks = navitems.filter((item) => item.isVisible)
    const socialLinks = socialitems.filter((item) => item.hasIcon)

    return (
        <footer className="pt-20 pb-5">
            <div className="container mx-auto p-6 max-w-6xl space-y-4">
                {/* Logo y descripción */}
                <div className="flex flex-col lg:flex-row justify-between gap-8">
                    <div className="flex flex-col gap-4 max-w-md">
                        <div className="flex items-center gap-2">
                            {logo?.image?.url && (
                                <Link href={logo.href} target={logo.isExternal ? '_blank' : '_self'}>
                                    <Image
                                        src={getStrapiMedia(logo.image.url) ?? ""}
                                        alt={logo.image.alternativeText || logo.text}
                                        width={40}
                                        height={40}
                                        className="h-8 w-8 object-contain"
                                    />
                                </Link>
                            )}
                            <h2 className="text-lg font-semibold">{logo.text}</h2>
                        </div>
                        <p className="text-sm max-w-xs text-muted-foreground">{text}</p>
                        <ul className="flex items-center gap-4">
                            {socialLinks.map((item) => (
                                <li key={item.id}>
                                    <a
                                        href={item.href}
                                        target={item.isExternal ? '_blank' : '_self'}
                                        rel={item.isExternal ? 'noopener noreferrer' : undefined}
                                        aria-label={item.text}
                                        className="hover:text-primary transition-colors"
                                    >
                                        {getSocialIcon(item.icon)}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Navegación */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="grid grid-cols-1">
                            <span className="mb-4 font-bold">Navegación</span>
                            {legalLinks.map((link) => (
                                <div key={link.id} className="mb-2">
                                    <Link
                                        href={link.href}
                                        target={link.isExternal ? '_blank' : '_self'}
                                        className="text-muted-foreground hover:text-primary transition-colors space-y-3 text-sm"
                                    >
                                        {link.label}
                                    </Link>
                                </div>
                            ))}
                        </div>
                        <div></div>
                        <div></div>
                    </div>
                </div>

                {/*  */}
                <Separator />
                <p className="text-xs text-muted-foreground mt-4">
                    © {new Date().getFullYear()} {logo.text}. Todos los derechos reservados.
                </p>
            </div>
        </footer>
    )
}

export default Footer
