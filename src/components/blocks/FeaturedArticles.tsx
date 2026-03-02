"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarDays, ArrowRight, Clock } from "lucide-react"
import type { BlockFeaturedArticles } from "@/types/strapi"
import Link from "next/link"
import Image from "next/image"
import { getStrapiMedia } from "@/lib/strapi"

export default function FeaturedArticles({ articles }: BlockFeaturedArticles) {
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()

  return (
    <section className="max-w-6xl mx-auto p-6">
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3" data-aos="fade-right"
            data-aos-duration="1500">
        {articles.map((article) => (
          <Card
            key={article.id}
            className="group hover:shadow-lg transition-shadow duration-300 pt-0 pb-6"
          >
            <div className="relative aspect-video overflow-hidden rounded-t-lg">
              <Image
                src={getStrapiMedia(article.featuredImage?.url)}
                alt={article.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>

            <CardHeader className="pb-3">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {article.time} min
                </div>
              </div>

              <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
                {article.title}
              </CardTitle>
              <CardDescription className="text-sm line-clamp-2">
                {article.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Avatar className="size-6">
                    <AvatarImage
                      src={getStrapiMedia(article.author?.image?.url)}
                      alt={article.author?.fullName}
                    />
                    <AvatarFallback className="text-xs">
                      {getInitials(article.author.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground">
                    {article.author.fullName}
                  </span>
                </div>

                <div className="flex items-center text-xs text-muted-foreground">
                  <CalendarDays className="h-3 w-3 mr-1" />
                  {article.date}
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mt-2">
                {article.contentTags?.slice(0, 3).map((tag) => (
                  <Badge
                    key={tag.id}
                    variant="outline"
                    className="text-xs px-2 py-0"
                    title={tag.description}
                  >
                    {tag.title}
                  </Badge>
                ))}
              </div>

              <Button
                asChild
                size="sm"
                className="w-full mt-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
              >
                <Link href={`/blog/${article.slug}`}>
                  Leer más
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
