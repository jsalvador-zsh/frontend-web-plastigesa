'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { getStrapiMedia } from '@/lib/strapi'
import { Header as HeaderType } from '@/types/strapi'
import { MenuIcon, X } from 'lucide-react'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { ThemeToggle } from '@/components/shared/ThemeToggle'

export default function Header({ data }: { data: HeaderType }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ease-out ${scrolled
        ? 'bg-white/85 dark:bg-neutral-950/80 backdrop-blur-md border-b border-black/5 dark:border-white/10 shadow-sm'
        : 'bg-transparent border-b border-transparent shadow-none'
        }`}
    >
      <div className="container mx-auto px-6 max-w-6xl flex items-center justify-between h-16">

        {/* Logo */}
        <Link href={data.logo.href} className="flex items-center space-x-2 group">
          {data.logo.image?.url && (
            <motion.div
              whileHover={{ rotate: [0, -8, 8, 0], scale: 1.05 }}
              transition={{ duration: 0.4 }}
            >
              <Image
                src={getStrapiMedia(data.logo.image.url)}
                alt={data.logo.image.alternativeText ?? data.logo.text}
                width={32}
                height={32}
                priority
                style={{ height: 'auto', width: 'auto' }}
                className="dark:invert"
              />
            </motion.div>
          )}
          <span className="text-base font-semibold tracking-tight">{data.logo.text}</span>
        </Link>

        {/* Nav desktop */}
        <nav className="hidden lg:flex items-center space-x-1">
          {data.navitems.filter(item => item.isVisible).map((item, i) => (
            <NavLink key={item.id} href={item.href} isExternal={item.isExternal} index={i}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* CTA + Mobile toggle */}
        <div className="flex items-center space-x-3">
          <ThemeToggle />
          {data.cta?.isVisible && (
            <motion.div
              className="hidden lg:block"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <Link
                href={data.cta.href}
                target={data.cta.isExternal ? '_blank' : '_self'}
                rel={data.cta.isExternal ? 'noopener noreferrer' : undefined}
              >
                <Button
                  variant={data.cta.type === 'primary' ? 'default' : 'secondary'}
                  className="relative overflow-hidden group/cta"
                >
                  {/* Shimmer */}
                  <span className="absolute inset-0 -translate-x-full group-hover/cta:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  {data.cta.label}
                </Button>
              </Link>
            </motion.div>
          )}

          {/* Mobile menu button */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={open ? 'close' : 'open'}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    {open ? <X className="size-5" /> : <MenuIcon className="size-5" />}
                  </motion.div>
                </AnimatePresence>
                <span className="sr-only">Abrir menú</span>
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className="w-3/4 max-w-xs p-0">
              <SheetHeader className="hidden">
                <SheetTitle><VisuallyHidden>Menú de navegación</VisuallyHidden></SheetTitle>
                <SheetDescription><VisuallyHidden>Enlaces de navegación</VisuallyHidden></SheetDescription>
              </SheetHeader>

              <div className="flex flex-col h-full pt-6 pb-8 px-6">
                {/* Logo mobile */}
                <Link
                  href={data.logo.href}
                  className="flex items-center space-x-2 mb-8"
                  onClick={() => setOpen(false)}
                >
                  {data.logo.image?.url && (
                    <Image
                      src={getStrapiMedia(data.logo.image.url)}
                      alt={data.logo.image.alternativeText ?? data.logo.text}
                      width={28}
                      height={28}
                      priority
                      style={{ height: 'auto', width: 'auto' }}
                      className="dark:invert"
                    />
                  )}
                  <span className="text-base font-semibold">{data.logo.text}</span>
                </Link>

                {/* Links mobile */}
                <nav className="flex flex-col space-y-1 flex-1">
                  {data.navitems.filter(item => item.isVisible).map((item, i) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07, duration: 0.3 }}
                    >
                      <Link
                        href={item.href}
                        target={item.isExternal ? '_blank' : '_self'}
                        rel={item.isExternal ? 'noopener noreferrer' : undefined}
                        className="block px-3 py-2.5 text-sm font-medium rounded-md text-foreground/80 hover:text-foreground hover:bg-muted transition-colors"
                        onClick={() => setOpen(false)}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                {/* CTA mobile */}
                {data.cta?.isVisible && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.3 }}
                  >
                    <Link
                      href={data.cta.href}
                      target={data.cta.isExternal ? '_blank' : '_self'}
                      rel={data.cta.isExternal ? 'noopener noreferrer' : undefined}
                      onClick={() => setOpen(false)}
                    >
                      <Button variant={data.cta.type === 'primary' ? 'default' : 'secondary'} className="w-full mt-4">
                        {data.cta.label}
                      </Button>
                    </Link>
                  </motion.div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  )
}

/* ── Nav link con underline animado ────────────────────────────────── */
function NavLink({
  href,
  isExternal,
  children,
  index,
}: {
  href: string
  isExternal?: boolean
  children: React.ReactNode
  index: number
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3 }}
    >
      <Link
        href={href}
        target={isExternal ? '_blank' : '_self'}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        className="relative px-3 py-1.5 text-sm font-medium text-foreground/75 hover:text-foreground transition-colors block"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {children}
        <motion.span
          className="absolute bottom-0 left-3 right-3 h-0.5 bg-green-600 rounded-full origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: hovered ? 1 : 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        />
      </Link>
    </motion.div>
  )
}
