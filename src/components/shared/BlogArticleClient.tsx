"use client"

import { useState, useRef } from "react"
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
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getStrapiMedia } from "@/lib/strapi"

// GSAP Animations
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import ScrollTrigger from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

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
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLElement>(null)

  // GSAP: Parallax Hero Image + Fade in Texto
  useGSAP(() => {
    // Reveal Incial
    const tl = gsap.timeline()

    tl.fromTo(
      ".article-title",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    )
      .fromTo(
        ".article-meta",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" },
        "-=0.4"
      )
      .fromTo(
        imageRef.current,
        { opacity: 0, scale: 0.95, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 1, ease: "power3.out" },
        "-=0.5"
      )

    // Scroll Parallax en la Imagen Hero
    if (imageRef.current) {
      gsap.to(imageRef.current.querySelector("img"), {
        y: "15%",
        ease: "none",
        scrollTrigger: {
          trigger: imageRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        }
      })
    }

    // Progress Bar y Content Fade
    if (contentRef.current) {
      gsap.to(".progress-bar", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.2, // suavizar lectura
        }
      })

      // Aparición perezosa párrafos markdown
      gsap.fromTo(
        contentRef.current.querySelectorAll("p, h2, h3, blockquote, ul"),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: contentRef.current,
            start: "top 80%",
            end: "bottom center",
            // Solo una vez
          }
        }
      )
    }

  }, { scope: containerRef })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getAuthorInitials = (name: string) => {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
  }

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200
    const wordCount = content.split(/\s+/).length
    return Math.ceil(wordCount / wordsPerMinute)
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
        alert("Enlace copiado al portapapeles")
        break
    }
  }

  const convertMarkdownToHtml = (markdown: string) => {
    return markdown
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^- (.*$)/gim, '<li>$1</li>')
      .replace(/(<li>.*<\/li>\s*)+/g, (match) => `<ul>${match}</ul>`)
      .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
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
    <div className="min-h-screen bg-background relative" ref={containerRef}>
      {/* Scroll Progress Bar global */}
      <div className="progress-bar fixed top-0 left-0 right-0 h-1.5 bg-green-500 scale-x-0 origin-left z-50 pointer-events-none" />

      {/* Hero Header Minimalista */}
      <div className="container mx-auto px-6 max-w-4xl pt-24 pb-8" ref={headerRef}>

        {/* Breadcrumb / Botón volver */}
        <Link
          href="/blog"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-green-600 transition-colors mb-8 article-meta"
        >
          <ArrowLeft className="size-4 mr-2" />
          Volver a artículos
        </Link>

        <div className="space-y-6">
          <Badge className="article-meta bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/60 border-0 rounded-full px-3 shadow-none">
            {article.contentTags && article.contentTags.length > 0 ? article.contentTags[0].title : 'Noticias'}
          </Badge>

          <h1 className="article-title text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none text-balance text-foreground">
            {article.title}
          </h1>

          <p className="article-meta text-xl md:text-2xl text-muted-foreground leading-relaxed text-pretty max-w-3xl">
            {article.description}
          </p>

          <div className="article-meta flex flex-wrap items-center justify-between gap-6 pt-6 border-t border-border/80">
            <div className="flex items-center gap-4">
              <Avatar className="size-12 ring-2 ring-primary/5">
                <AvatarImage
                  src={getStrapiMedia(article.author.image?.url)}
                  alt={article.author.fullName}
                  className="object-cover"
                />
                <AvatarFallback className="bg-green-100 text-green-800 font-semibold">{getAuthorInitials(article.author.fullName)}</AvatarFallback>
              </Avatar>
              <div className="space-y-1 text-sm">
                <p className="font-semibold text-foreground leading-none">{article.author.fullName}</p>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <span className="flex items-center"><CalendarDays className="size-3.5 mr-1" />{article.date}</span>
                  <span className="flex items-center text-green-700/80 font-medium"><Clock className="size-3.5 mr-1 text-green-600" />{readTime} min read</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="secondary" size="icon" className="rounded-full shadow-sm dark:bg-white/5 dark:hover:bg-white/10 dark:border dark:border-white/10" onClick={() => handleShare("twitter")}>
                <Twitter className="size-4 text-foreground/70 dark:text-foreground/90" />
              </Button>
              <Button variant="secondary" size="icon" className="rounded-full shadow-sm dark:bg-white/5 dark:hover:bg-white/10 dark:border dark:border-white/10" onClick={() => handleShare("facebook")}>
                <Facebook className="size-4 text-foreground/70 dark:text-foreground/90" />
              </Button>
              <Button variant="secondary" size="icon" className="rounded-full shadow-sm dark:bg-white/5 dark:hover:bg-white/10 dark:border dark:border-white/10" onClick={() => handleShare("linkedin")}>
                <Linkedin className="size-4 text-foreground/70 dark:text-foreground/90" />
              </Button>
              <Button variant="secondary" size="icon" className="rounded-full shadow-sm dark:bg-white/5 dark:hover:bg-white/10 dark:border dark:border-white/10" onClick={() => handleShare("copy")}>
                <Link2 className="size-4 text-foreground/70 dark:text-foreground/90" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 max-w-5xl mb-12">
        {/* Imagen principal envolvente con Parallax GSAP */}
        {article.featuredImage?.url && (
          <div
            ref={imageRef}
            className="relative aspect-[21/9] w-full overflow-hidden rounded-[2rem] shadow-2xl bg-muted"
          >
            <Image
              src={getStrapiMedia(article.featuredImage.url)!}
              alt={article.featuredImage.alternativeText || article.title}
              fill
              className="object-cover scale-110"
              // scale-110 necesario por el offset the GSAP translate Y parallax
              sizes="(max-width: 1024px) 100vw, 1024px"
              priority
            />
            {/* Soft gradient overlay para enmarcar */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/0 to-transparent pointer-events-none" />
          </div>
        )}
      </div>

      {/* Markdown Content con GSAP text reveals */}
      <div className="container mx-auto px-6 max-w-3xl pb-24">
        <article
          ref={contentRef}
          className="prose prose-lg md:prose-xl prose-headings:font-bold prose-headings:tracking-tight prose-a:text-green-600 dark:prose-a:text-green-500 hover:prose-a:text-green-500 dark:hover:prose-a:text-green-400 prose-img:rounded-xl prose-img:shadow-lg prose-blockquote:border-l-4 prose-blockquote:border-green-500 prose-blockquote:bg-green-50/50 dark:prose-blockquote:bg-green-950/30 prose-blockquote:py-2 prose-blockquote:px-5 prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-blockquote:text-foreground/90 max-w-none mb-16 text-foreground/90 font-serif leading-relaxed text-pretty"
          dangerouslySetInnerHTML={{ __html: convertMarkdownToHtml(article.content) }}
        />

        <Separator className="mb-12" />

        {/* Tags Foot */}
        {article.contentTags && article.contentTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-16">
            <span className="text-sm font-semibold mr-2 self-center text-muted-foreground">Etiquetas: </span>
            {article.contentTags.map((tag) => (
              <Badge key={tag.id} variant="secondary" className="bg-muted hover:bg-muted/80 text-foreground font-normal px-3 py-1 rounded-sm shadow-none">
                #{tag.title}
              </Badge>
            ))}
          </div>
        )}

        {/* CTA Banner de lectura finalizado */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/40 dark:to-emerald-950/20 rounded-3xl p-10 text-center border border-green-100/50 dark:border-green-900/30 shadow-sm relative overflow-hidden">
          <div className="absolute -inset-x-20 top-0 h-40 bg-white/20 dark:bg-green-900/10 blur-[60px] rounded-full pointer-events-none" />

          <h3 className="text-2xl font-bold mb-3 text-green-950 dark:text-green-50">¿Te resultó útil?</h3>
          <p className="text-green-800/80 dark:text-green-200/70 mb-8 max-w-md mx-auto text-balance">
            Ayúdanos a llegar a más personas compartiendo este artículo con tus colegas o redes.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Button
              className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white rounded-full px-8 shadow-green-900/10 dark:shadow-green-900/20 shadow-lg transition-transform hover:scale-105 active:scale-95"
              onClick={() => handleShare("copy")}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Copiar Enlace
            </Button>
            <Button
              variant="outline"
              className="rounded-full px-8 bg-white dark:bg-background hover:bg-gray-50 dark:hover:bg-muted text-foreground border-border/60 hover:border-border transition-transform hover:scale-105 active:scale-95"
              asChild
            >
              <Link href="/blog">
                Leer más artículos
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}