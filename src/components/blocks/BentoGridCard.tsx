"use client"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { BlockBentoGridCard } from "@/types/strapi"
import { getStrapiMedia } from "@/lib/strapi"
import Image from "next/image"

export default function BentoGridCard({ cards }: { cards: BlockBentoGridCard["cards"] }) {
  return (
    <section className="pb-12">
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 auto-rows-[200px]">
          {cards.map((item) => (
            <Card
              key={item.id}
              data-aos="zoom-in"
              data-aos-duration="1500"
              className={`group relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${item.sizeCard === "large"
                  ? "md:col-span-2 md:row-span-2"
                  : item.sizeCard === "wide"
                    ? "md:col-span-2 md:row-span-1"
                    : item.sizeCard === "medium"
                      ? "md:col-span-1 md:row-span-2"
                      : "md:col-span-1 md:row-span-1"
                }`}
            >
              <div className="absolute inset-0">
                <Image
                  src={getStrapiMedia(item.image.url) || "/placeholder.png"}
                  alt={item.image?.alternativeText || item.heading}
                  fill
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 16vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              </div>

              <div className="absolute top-4 left-4">
                <Badge className="bg-primary hover:bg-primary/40">{item.badge}</Badge>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-lg font-bold mb-2">{item.heading}</h3>
                <p className="text-sm opacity-90 line-clamp-4">{item.text}</p>
              </div>

              <div className="absolute inset-0 bg-green-600/0 group-hover:bg-green-600/10 transition-colors duration-300" />
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
