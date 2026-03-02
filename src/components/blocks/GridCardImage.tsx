import Image from "next/image"
import { BlockGridCardImage } from "@/types/strapi"
import { getStrapiMedia } from "@/lib/strapi"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function GridCardImage(props: BlockGridCardImage) {
  const { id, cards } = props

  return (
    <section key={id} className="p-4">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-3 md:grid-cols-4">
          {cards.slice(0, 8).map((card) => (
            <Card
              key={card.id}
              data-aos="flip-left"
              data-aos-duration="1500"
              className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow h-full"
            >
              {card.image && (
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src={getStrapiMedia(card.image.url)}
                    alt={card.heading ?? "Imagen"}
                    fill
                    className="object-cover -z-10"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              )}
              <CardHeader className="flex flex-col">
                {card.badge && (
                  <Badge variant="outline" className="text-xs px-2 py-0 capitalize">
                    {card.badge}
                  </Badge>
                )}
                <CardTitle className="text-xl font-semibold transition-colors">
                  {card.heading}
                </CardTitle>
                <CardDescription className="text-muted-foreground mb-4">
                  {card.text}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
