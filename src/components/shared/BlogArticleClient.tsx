"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  CalendarDays,
  Clock,
  Twitter,
  Facebook,
  Linkedin,
  Link2,
  Share2,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getStrapiMedia } from "@/lib/strapi"

interface BlogArticleClientProps {
  article: {
    id: number
    title: string
    description: string
    content: string
    publishedAt: string
    time?: number
    date: string
    featuredImage?: {
      url: string
      alternativeText?: string
    }
    author: {
      fullName: string
      bio?: string
      image?: {
        url: string
      }
    }
    contentTags?: Array<{
      id: number
      title: string
      description?: string
    }>
  }
}

export default function BlogArticleClient({ article }: BlogArticleClientProps) {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [likes, setLikes] = useState(Math.floor(Math.random() * 50) + 10) // Número aleatorio para demo

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getAuthorInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200
    const wordCount = content.split(/\s+/).length
    return Math.ceil(wordCount / wordsPerMinute)
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikes((prev) => (isLiked ? prev - 1 : prev + 1))
  }

  const handleShare = (platform: string) => {
    const url = window.location.href
    const text = `${article.title} - ${article.description}`

    switch (platform) {
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`)
        break
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`)
        break
      case "linkedin":
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`)
        break
      case "copy":
        navigator.clipboard.writeText(url)
        // Aquí podrías mostrar un toast de confirmación
        alert("Enlace copiado al portapapeles")
        break
    }
  }

  // Convertir markdown básico a HTML
  const convertMarkdownToHtml = (markdown: string) => {
    return markdown
      // Headers
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      // Bold text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Italic text
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Lists
      .replace(/^- (.*$)/gim, '<li>$1</li>')
      // Wrap consecutive <li> elements in <ul>
      .replace(/(<li>.*<\/li>\s*)+/g, (match) => `<ul>${match}</ul>`)
      // Blockquotes
      .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
      // Line breaks to paragraphs
      .split('\n')
      .map(line => {
        line = line.trim()
        if (!line || line.startsWith('<')) return line
        return `<p>${line}</p>`
      })
      .join('\n')
  }

  const readTime = article.time || calculateReadTime(article.content)

  return (
    <div className="min-h-screen bg-background">
      {/* Header con navegación */}
      {/* <div className="border-b">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          <Button asChild className="mb-4">
            <Link href="/blog">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al blog
            </Link>
          </Button>
        </div>
      </div> */}

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Imagen principal */}
        {article.featuredImage?.url && (
          <div className="relative aspect-video overflow-hidden rounded-lg mb-8">
            <Image
              src={getStrapiMedia(article.featuredImage.url)}
              alt={article.featuredImage.alternativeText || article.title}
              fill
              className="object-cover"
              sizes="(max-width: 896px) 100vw, 896px"
              priority
            />
          </div>
        )}

        {/* Metadatos del artículo */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-4 leading-tight">{article.title}</h1>

          <p className="text-xl text-muted-foreground mb-6 leading-relaxed">{article.description}</p>

          {/* Información del autor y fecha */}
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage 
                  src={getStrapiMedia(article.author.image?.url)} 
                  alt={article.author.fullName}
                  className="object-cover"
                />
                <AvatarFallback>{getAuthorInitials(article.author.fullName)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{article.author.fullName}</p>
                {article.author.bio && (
                  <p className="text-sm text-muted-foreground">{article.author.bio}</p>
                )}
                <div className="flex items-center text-sm text-muted-foreground space-x-4 mt-1">
                  <div className="flex items-center">
                    <CalendarDays className="h-4 w-4 mr-1" />
                    {article.date}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {readTime} min de lectura
                  </div>
                </div>
              </div>
            </div>

            {/* Acciones del artículo */}
            <div className="flex items-center space-x-2">
              {/* Botones de compartir */}
              <div className="flex items-center space-x-1">
                <Button variant="outline" size="sm" onClick={() => handleShare("twitter")}>
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleShare("facebook")}>
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleShare("linkedin")}>
                  <Linkedin className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleShare("copy")}>
                  <Link2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Tags */}
          {article.contentTags && article.contentTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {article.contentTags.map((tag) => (
                <Badge key={tag.id} variant="outline">
                  #{tag.title}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <Separator className="mb-8" />

        {/* Contenido del artículo con Tailwind Typography */}
        <article 
          className="prose prose-lg max-w-none mb-12 prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-blockquote:text-muted-foreground prose-blockquote:border-l-border prose-li:text-foreground"
          dangerouslySetInnerHTML={{ __html: convertMarkdownToHtml(article.content) }}
        />

        <Separator className="mb-8" />

        {/* Call to action final */}
        <div className="text-center bg-muted/50 rounded-lg p-8">
          <h3 className="text-2xl font-bold mb-4">¿Te gustó este artículo?</h3>
          <p className="text-muted-foreground mb-6">
            Descubre más contenido sobre productos plásticos industriales y agricultura.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="/blog">
                Ver más artículos
              </Link>
            </Button>
            <Button variant="outline" onClick={() => handleShare("copy")}>
              <Share2 className="h-4 w-4 mr-2" />
              Compartir artículo
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}