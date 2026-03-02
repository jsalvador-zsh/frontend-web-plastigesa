"use client"

import type { BlockCarousel } from "@/types/strapi"
import { getStrapiMedia } from "@/lib/strapi"
import Image from "next/image"

interface CarouselBlockProps extends BlockCarousel {
  rows?: number
  directions?: ("left" | "right")[]
  speeds?: number[]
}

export function MultiRowCarouselBlock({
  images,
  rows = 2,
  directions = ["left", "right"],
  speeds = [30, 30],
}: CarouselBlockProps) {
  return (
    <div className="max-w-6xl mx-auto px-4 space-y-8">
      {Array.from({ length: rows }).map((_, rowIndex) => {
        const direction = directions[rowIndex % directions.length]
        const speed = speeds[rowIndex % speeds.length]
        const animationClass =
          direction === "right"
            ? "animate-carousel-right"
            : "animate-carousel-left"

        return (
          <div
            key={rowIndex}
            className="relative overflow-hidden w-full"
            style={{ height: "5rem" }}
          >
            <div
              className={`flex gap-12 ${animationClass}`}
              style={{ width: "200%", animationDuration: `${speed}s` }}
            >
              {[...images, ...images].map((img, index) => (
                <div
                  key={`${rowIndex}-${img.id}-${index}`}
                  className="relative flex-shrink-0 flex justify-center items-center h-full w-32"
                >
                  <Image
                    src={getStrapiMedia(img.url) ?? ""}
                    alt={img.alternativeText ?? "Logo"}
                    fill
                    className="object-contain grayscale opacity-80"
                    sizes="128px"
                  />
                </div>
              ))}
            </div>
          </div>
        )
      })}

      <style>{`
        @keyframes carousel-left {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }

        @keyframes carousel-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }

        .animate-carousel-left {
          animation: carousel-left linear infinite;
        }

        .animate-carousel-right {
          animation: carousel-right linear infinite;
        }
      `}</style>
    </div>
  )
}
