import type { BlockTestimonials } from "@/types/strapi"
import { getStrapiMedia } from "@/lib/strapi"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"
import { Marquee } from "@/components/magicui/marquee"

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
        />
      ))}
    </div>
  )
}

function TestimonialCard({ item }: { item: BlockTestimonials["testimonials"][0] }) {
  return (
    <Card className="w-72 shrink-0 mx-3">
      <CardContent className="p-6 space-y-4">
        <StarRating rating={item.rating} />
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
          &ldquo;{item.quote}&rdquo;
        </p>
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={getStrapiMedia(item.avatar?.url)}
              alt={item.name}
            />
            <AvatarFallback>{getInitials(item.name)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold">{item.name}</p>
            <p className="text-xs text-muted-foreground">
              {item.role}{item.company ? ` · ${item.company}` : ""}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function TestimonialsBlock({ heading, subheading, testimonials }: BlockTestimonials) {
  if (!testimonials?.length) return null

  const half = Math.ceil(testimonials.length / 2)
  const firstRow = testimonials.slice(0, half)
  const secondRow = testimonials.slice(half)

  return (
    <section className="py-16 overflow-hidden">
      <div className="container mx-auto p-6 max-w-6xl text-center mb-12" data-aos="fade-up" data-aos-duration="1000">
        <h2 className="text-3xl font-bold mb-3">{heading}</h2>
        {subheading && (
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">{subheading}</p>
        )}
      </div>

      <div className="space-y-4">
        <Marquee pauseOnHover className="[--duration:40s]">
          {firstRow.map((item) => (
            <TestimonialCard key={item.id} item={item} />
          ))}
        </Marquee>
        {secondRow.length > 0 && (
          <Marquee reverse pauseOnHover className="[--duration:40s]">
            {secondRow.map((item) => (
              <TestimonialCard key={item.id} item={item} />
            ))}
          </Marquee>
        )}
      </div>
    </section>
  )
}
