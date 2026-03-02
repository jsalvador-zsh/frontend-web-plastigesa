'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Separator } from "@/components/ui/separator"
import { getStrapiMedia } from '@/lib/strapi'
import { Header as HeaderType } from '@/types/strapi'
import { MenuIcon } from 'lucide-react'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'

export default function Header({ data }: { data: HeaderType }) {
  const [open, setOpen] = useState(false)

  return (
    <header className="border-b">
      <div className="container mx-auto p-6 max-w-6xl flex items-center justify-between">
        {/* Logo (izquierda) */}
        <Link href={data.logo.href} className="flex items-center space-x-2">
          {data.logo.image?.url && (
            <Image
              src={getStrapiMedia(data.logo.image.url)}
              alt={data.logo.image.alternativeText ?? data.logo.text}
              width={30}
              height={30}
              priority
              style={{ height: 'auto', width: 'auto' }}
            />
          )}
          <span className="text-base font-semibold">{data.logo.text}</span>
        </Link>

        {/* Nav (centro) */}
        <nav className="hidden lg:flex items-center space-x-6">
          {data.navitems.filter(item => item.isVisible).map(item => (
            <Link
              key={item.id}
              href={item.href}
              target={item.isExternal ? '_blank' : '_self'}
              rel={item.isExternal ? 'noopener noreferrer' : undefined}
              className="text-sm"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* CTA y Menú Mobile (derecha) */}
        <div className="flex items-center space-x-2">
          {data.cta?.isVisible && (
            <Link
              href={data.cta.href}
              target={data.cta.isExternal ? '_blank' : '_self'}
              rel={data.cta.isExternal ? 'noopener noreferrer' : undefined}
              className="hidden lg:block"
            >
              <Button variant={data.cta.type === 'primary' ? 'default' : 'secondary'}>
                {data.cta.label}
              </Button>
            </Link>
          )}

          {/* Botón menú mobile */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden">
                <MenuIcon className="size-4" />
                <span className="sr-only">Abrir menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-3/4 p-4">
              <SheetHeader className="hidden">
                <SheetTitle>
                  <VisuallyHidden>Título del menú móvil</VisuallyHidden>
                </SheetTitle>
                <SheetDescription>
                  <VisuallyHidden>Enlaces de navegación móvil</VisuallyHidden>
                </SheetDescription>
              </SheetHeader>

              {/* Logo en menú mobile */}
              <Link href={data.logo.href} className="flex items-center space-x-2" onClick={() => setOpen(false)}>
                {data.logo.image?.url && (
                  <Image
                    src={getStrapiMedia(data.logo.image.url)}
                    alt={data.logo.image.alternativeText ?? data.logo.text}
                    width={30}
                    height={30}
                    priority
                    style={{ height: 'auto', width: 'auto' }}
                  />
                )}
                <span className="text-base font-semibold">{data.logo.text}</span>
              </Link>

              <Separator className="mb-4" />

              {/* Enlaces mobile */}
              <nav className="flex flex-col space-y-4">
                {data.navitems.filter(item => item.isVisible).map(item => (
                  <Link
                    key={item.id}
                    href={item.href}
                    target={item.isExternal ? '_blank' : '_self'}
                    rel={item.isExternal ? 'noopener noreferrer' : undefined}
                    className="text-sm"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                {data.cta?.isVisible && (
                  <Link
                    href={data.cta.href}
                    target={data.cta.isExternal ? '_blank' : '_self'}
                    rel={data.cta.isExternal ? 'noopener noreferrer' : undefined}
                    onClick={() => setOpen(false)}
                  >
                    <Button variant={data.cta.type === 'primary' ? 'default' : 'secondary'} className="w-full">
                      {data.cta.label}
                    </Button>
                  </Link>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
