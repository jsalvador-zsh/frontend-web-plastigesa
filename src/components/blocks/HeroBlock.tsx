// components/blocks/HeroBlock.tsx

import type { HeroBlock } from "@/types/strapi"
import { getStrapiMedia } from "@/lib/strapi"
import { Marquee } from "@/components/magicui/marquee"
import { WordRotate } from "@/components/magicui/word-rotate"
import { cn } from "@/lib/utils"
import Link from "next/link"
import Image from "next/image"
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";

export default function HeroBlock(props: HeroBlock) {
  const { heading, span, text, images, links } = props

  // Si viene como rich text, extrae solo los textos
  const rotatingWords = span.flatMap(s =>
    s.children.map(child => child.text).filter(Boolean)
  )

  return (
    <section className="relative w-full px-6 py-20 md:py-28 bg-background overflow-hidden">
      <div className="container mx-auto p-6 max-w-6xl flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Left: Text */}
        <div className="w-full md:w-3/4 text-center md:text-left" data-aos="fade-left" data-aos-duration="1500">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground">
            {heading}
          </h1>

          {/* WordRotate */}
          {rotatingWords.length > 0 && (
            <WordRotate
              words={rotatingWords}
              duration={3000}
              className="text-4xl md:text-6xl font-extrabold text-green-600"
            />
          )}

          {text && (
            <p className="mt-4 text-base md:text-lg text-muted-foreground text-pretty">
              {text}
            </p>
          )}
          {/* Links */}
          <div className="flex flex-wrap gap-4 pt-4 justify-center md:justify-start">
            {links.map((link) => (
              <InteractiveHoverButton
                key={link.id}
                className={cn(
                  "rounded-lg",
                  link.isButton && "shadow",
                  link.type === "primary" ? "" : "border"
                )}>
                <Link
                  href={link.href}
                  target={link.isExternal ? "_blank" : "_self"}
                  rel={link.isExternal ? "noopener noreferrer" : undefined}
                >
                  {link.label}
                </Link>
              </InteractiveHoverButton>
            ))}
          </div>

        </div>

        {/* Right: 3-column Marquee */}
        {images.length > 0 && (
          <div className="relative w-full md:w-1/2 h-[400px] flex items-center justify-center overflow-hidden [perspective:1000px]" data-aos="fade-down" data-aos-duration="1500">
            <div
              className="grid grid-cols-2 gap-4 items-center justify-items-center"
            >
              {/* Col 1 */}
              <Marquee vertical pauseOnHover className="[--duration:60s]">
                {images.map((img) => (
                  <ImageCard key={img.id} img={img} />
                ))}
              </Marquee>

              {/* Col 2 - reverse */}
              <Marquee vertical reverse pauseOnHover className="[--duration:60s]">
                {images.map((img) => (
                  <ImageCard key={`reverse-${img.id}`} img={img} />
                ))}
              </Marquee>
            </div>

            {/* Gradient overlays */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-background"></div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-background"></div>
          </div>
        )}
      </div>
    </section>
  )
}

function ImageCard({ img }: { img: HeroBlock["images"][0] }) {
  return (
    <figure
      className={cn(
        "relative h-40 w-36 sm:w-40 rounded-xl border p-2 mx-2 my-2",
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
      )}
    >
      <Image
        src={getStrapiMedia(img.url)}
        alt={img.alternativeText ?? ""}
        fill
        className="object-contain p-1"
        sizes="160px"
      />
    </figure>
  )
}
