"use client"

import { useState, useMemo, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  CalendarDays,
  Clock,
  Search,
  ArrowUpRight,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getStrapiMedia } from "@/lib/strapi"
import { Article } from "@/types/strapi"

// Animaciones GSAP
import gsap from "gsap"
import { useGSAP } from "@gsap/react"

interface BlogPageClientProps {
  articles: Article[]
  initialPage: number
  initialCategory?: string
  initialSearch?: string
}

const ARTICLES_PER_PAGE = 6

export default function BlogPageClient({
  articles,
  initialPage = 1,
  initialCategory,
  initialSearch
}: BlogPageClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [currentPage, setCurrentPage] = useState(initialPage)
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || "all")
  const [searchQuery, setSearchQuery] = useState(initialSearch || "")

  const containerRef = useRef<HTMLDivElement>(null)

  // Obtener todas las categorías únicas de los tags
  const categories = useMemo(() => {
    const allCategories = articles.flatMap(article =>
      article.contentTags?.map((tag: any) => tag.title) || []
    )
    return Array.from(new Set(allCategories)).sort()
  }, [articles])

  // Filtrar artículos
  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      const matchesCategory = selectedCategory === "all" ||
        article.contentTags?.some((tag: any) => tag.title === selectedCategory)

      const matchesSearch = !searchQuery ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.description.toLowerCase().includes(searchQuery.toLowerCase())

      return matchesCategory && matchesSearch
    })
  }, [articles, selectedCategory, searchQuery])

  // Paginación
  const totalPages = Math.ceil(filteredArticles.length / ARTICLES_PER_PAGE)
  const startIndex = (currentPage - 1) * ARTICLES_PER_PAGE
  const paginatedArticles = filteredArticles.slice(startIndex, startIndex + ARTICLES_PER_PAGE)

  // GSAP Animation: Entrada con Stagger
  useGSAP(() => {
    gsap.fromTo(
      ".blog-card",
      { opacity: 0, y: 40, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.1, ease: "power3.out" }
    )
  }, { dependencies: [currentPage, selectedCategory, searchQuery], scope: containerRef })

  // Helper functions
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200
    const wordCount = content.split(/\s+/).length
    return Math.ceil(wordCount / wordsPerMinute)
  }

  // Update URL params
  const updateUrlParams = (page: number, category: string, search: string) => {
    const params = new URLSearchParams()
    if (page > 1) params.set('page', page.toString())
    if (category !== 'all') params.set('category', category)
    if (search) params.set('search', search)

    const url = params.toString() ? `/blog?${params.toString()}` : '/blog'
    router.push(url, { scroll: false })
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setCurrentPage(1)
    updateUrlParams(1, category, searchQuery)
  }

  const handleSearchChange = (search: string) => {
    setSearchQuery(search)
    setCurrentPage(1)
    updateUrlParams(1, selectedCategory, search)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    updateUrlParams(page, selectedCategory, searchQuery)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="container mx-auto max-w-6xl p-6 py-12" ref={containerRef}>

      {/* Header moderno */}
      <div className="text-center mb-16 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-green-100/40 blur-[100px] rounded-full -z-10 pointer-events-none" />
        <Badge className="mb-4 bg-green-50 text-green-700 hover:bg-green-100 border-green-200">
          Noticias y Artículos
        </Badge>
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight text-foreground">Nuestro Blog</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
          Descubre artículos sobre productos plásticos industriales, agricultura y más.
          Mantente actualizado con las últimas tendencias de la industria.
        </p>
      </div>

      {/* Barra de Filtros interactiva */}
      <div className="flex flex-col md:flex-row gap-4 mb-10 items-center bg-card p-3 rounded-2xl border border-border/60 shadow-sm">
        <div className="flex-1 w-full relative group">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-green-600 h-4 w-4" />
          <Input
            type="text"
            placeholder="Buscar por título o contenido..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-11 border-none shadow-none focus-visible:ring-0 text-base"
          />
        </div>

        <div className="h-px md:h-8 w-full md:w-px bg-border/60" />

        <div className="w-full md:w-64">
          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger className="border-none shadow-none focus:ring-0 w-full px-4 text-base font-medium">
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="font-medium">Todas las categorías</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Resultados stats */}
      <div className="mb-8 flex items-center gap-3 text-sm text-muted-foreground font-medium">
        <Badge variant="secondary" className="px-3 py-1 bg-muted/50 rounded-full border-0">
          {filteredArticles.length} resultados
        </Badge>
        {searchQuery && (
          <span>para "{searchQuery}"</span>
        )}
        {selectedCategory !== "all" && (
          <span>en "{selectedCategory}"</span>
        )}
      </div>

      {/* Grid de artículos con diseño premium */}
      {paginatedArticles.length === 0 ? (
        <div className="text-center py-24 bg-card rounded-3xl border border-dashed border-border/80">
          <h3 className="text-2xl font-semibold mb-3">No hay nada aquí</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Intenta cambiar tus términos de búsqueda o selecciona una categoría diferente.
          </p>
          <Button
            variant="outline"
            className="rounded-full shadow-sm"
            onClick={() => {
              setSearchQuery("")
              setSelectedCategory("all")
              setCurrentPage(1)
              updateUrlParams(1, "all", "")
            }}
          >
            Limpiar filtros
          </Button>
        </div>
      ) : (
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-16">
          {paginatedArticles.map((article) => (
            <div key={article.id} className="blog-card opacity-0">
              <Link href={`/blog/${article.slug}`} className="group block h-full">
                <Card className="h-full flex flex-col border border-border/60 bg-card overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-green-900/5 dark:hover:shadow-green-900/20 hover:-translate-y-1">

                  {/* Banner de Imagen */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {article.featuredImage?.url ? (
                      <Image
                        src={getStrapiMedia(article.featuredImage.url)!}
                        alt={article.featuredImage.alternativeText || article.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-green-50 flex items-center justify-center">
                        <span className="text-green-800/40 text-sm font-medium">Sin portada</span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Tags Flotantes sobre imagen */}
                    {article.contentTags && article.contentTags.length > 0 && (
                      <div className="absolute top-4 left-4 flex gap-1.5 flex-wrap z-10">
                        {article.contentTags.slice(0, 2).map((tag: any) => (
                          <span key={tag.id} className="bg-black/50 backdrop-blur-md text-white px-2.5 py-1 rounded-md text-xs font-medium border-0 tracking-wide">
                            {tag.title}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <CardHeader className="flex-1 pb-4 pt-6 px-6">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium mb-3">
                      <span className="flex items-center bg-muted px-2 py-0.5 rounded text-foreground/80">
                        <CalendarDays className="size-3.5 mr-1" />
                        {formatDate(article.publishedAt)}
                      </span>
                      <span className="flex items-center">
                        <Clock className="size-3.5 mr-1 text-green-600" />
                        {article.time || calculateReadTime(article.content)} min read
                      </span>
                    </div>

                    <CardTitle className="text-xl leading-tight group-hover:text-green-700 transition-colors line-clamp-2 mt-1 mb-2 tracking-tight block">
                      {article.title}
                    </CardTitle>
                    <CardDescription className="text-sm line-clamp-3 leading-relaxed">
                      {article.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pt-0 px-6 pb-6 mt-auto">
                    <div className="h-px bg-border/60 mb-5 w-full" />
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-8 ring-2 ring-background shadow-sm">
                          <AvatarImage
                            src={getStrapiMedia(article.author?.image?.url)}
                            alt={article.author?.fullName}
                          />
                          <AvatarFallback className="text-xs bg-green-100 text-green-800">
                            {getInitials(article.author?.fullName || "A")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-semibold truncate text-foreground/90">
                          {article.author?.fullName || "Plastigesa Editores"}
                        </span>
                      </div>

                      {/* Icono Flecha Hover */}
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-50 text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors duration-300">
                        <ArrowUpRight className="size-4 group-hover:rotate-45 transition-transform duration-300" />
                      </div>
                    </div>
                  </CardContent>

                  {/* Borde inferior animado */}
                  <div className="h-1 w-full bg-gradient-to-r from-green-500 to-emerald-400 scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 absolute bottom-0 left-0" />
                </Card>
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Paginación minimalista */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-4">
          <Button
            variant="outline"
            className="rounded-full shadow-sm hover:bg-muted"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="size-4 mr-1" /> Anterior
          </Button>

          <div className="flex items-center gap-1.5 px-3">
            <span className="text-sm font-semibold">{currentPage}</span>
            <span className="text-sm text-muted-foreground mx-1">de</span>
            <span className="text-sm font-medium">{totalPages}</span>
          </div>

          <Button
            variant="outline"
            className="rounded-full shadow-sm hover:bg-muted"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Siguiente <ChevronRight className="size-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  )
}