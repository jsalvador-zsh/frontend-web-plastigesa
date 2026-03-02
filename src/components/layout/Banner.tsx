'use client'

import { useState } from 'react'
import { X, Store } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Banner as BannerType } from '@/types/strapi'

interface BannerProps {
  data: BannerType
}

const Banner = ({ data }: BannerProps) => {
  const [isVisible, setIsVisible] = useState(data.isVisible)

  if (!isVisible) return null

  return (
    <section className="w-full bg-background border-b px-4 py-3">
      <div className="flex flex-row items-center justify-between gap-2 sm:gap-4 text-center sm:text-left">
        <div className="flex flex-1 flex-col sm:flex-row sm:items-center sm:justify-center gap-2">
          <span className="flex items-center justify-center text-sm font-medium text-primary">
            <Store className="size-4 mr-1" />
            {data.badge}
          </span>
          <span className="text-sm text-muted-foreground">
            {data.label}
            <a
              href={data.href}
              target={data.isExternal ? '_blank' : '_self'}
              rel={data.isExternal ? 'noopener noreferrer' : undefined}
              className="ml-2 underline underline-offset-2 hover:text-foreground"
            >
              {data.isExternal ? 'Ir' : 'Leer más'}
            </a>
          </span>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="flex-none sm:ml-auto sm:mr-0"
          onClick={() => setIsVisible(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </section>
  )
}

export default Banner
