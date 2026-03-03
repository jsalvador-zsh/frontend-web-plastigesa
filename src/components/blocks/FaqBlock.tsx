'use client'

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'motion/react'
import type { BlockFaq } from '@/types/strapi'
import { ChevronDown } from 'lucide-react'

export function FaqBlock({ faqs }: BlockFaq) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px 0px' })
  const [openId, setOpenId] = useState<number | null>(faqs[0]?.id ?? null)

  return (
    <div ref={ref} className="max-w-3xl mx-auto px-6 py-4 space-y-3">
      {faqs.map((faq, i) => {
        const isOpen = openId === faq.id
        return (
          <motion.div
            key={faq.id}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{
              delay: i * 0.07,
              duration: 0.5,
              ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
            }}
            className={`rounded-xl border overflow-hidden transition-colors duration-200 ${isOpen ? 'border-green-200 bg-green-50/50 dark:border-green-900/40 dark:bg-green-950/20' : 'border-border bg-card'
              }`}
          >
            {/* Trigger */}
            <button
              onClick={() => setOpenId(isOpen ? null : faq.id)}
              className="w-full flex items-center justify-between px-6 py-4 text-left font-semibold text-base group"
              aria-expanded={isOpen}
            >
              <span className={`transition-colors duration-200 ${isOpen ? 'text-green-700' : 'text-foreground'}`}>
                {faq.heading}
              </span>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                className={`shrink-0 ml-4 transition-colors duration-200 ${isOpen ? 'text-green-600' : 'text-muted-foreground'}`}
              >
                <ChevronDown className="size-5" />
              </motion.div>
            </button>

            {/* Contenido con spring */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    height: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
                    opacity: { duration: 0.25, delay: isOpen ? 0.05 : 0 },
                  }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-5 pt-1 text-muted-foreground text-base leading-relaxed text-pretty">
                    {faq.text}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )
      })}
    </div>
  )
}
