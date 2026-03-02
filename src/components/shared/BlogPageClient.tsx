"use client"

import { useState, useMemo } from "react"
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
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"
import { getStrapiMedia } from "@/lib/strapi"
import { Article } from "@/types/strapi"

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

  // Obtener todas las categorías únicas de los tags
  const categories = useMemo(() => {
    const allCategories = articles.flatMap(article => 
      article.contentTags?.map((tag:any) => tag.title) || []
    )
    return Array.from(new Set(allCategories)).sort()
  }, [articles])

  // Filtrar artículos
  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      const matchesCategory = selectedCategory === "all" || 
        article.contentTags?.some((tag:any) => tag.title === selectedCategory)
      
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

  // Helper functions
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
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="container mx-auto max-w-6xl p-6">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Blog</h1>
        <p className="text-base text-muted-foreground max-w-2xl mx-auto">
          Descubre artículos sobre productos plásticos industriales, agricultura y más. 
          Mantente actualizado con las últimas tendencias y consejos de la industria.
        </p>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Buscar artículos..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <Select value={selectedCategory} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Estadísticas */}
      <div className="mb-6 text-sm text-muted-foreground">
        Mostrando {paginatedArticles.length} de {filteredArticles.length} artículos
        {searchQuery && (
          <span> para "{searchQuery}"</span>
        )}
        {selectedCategory !== "all" && (
          <span> en la categoría "{selectedCategory}"</span>
        )}
      </div>

      {/* Grid de artículos */}
      {paginatedArticles.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-2xl font-semibold mb-4">No se encontraron artículos</h3>
          <p className="text-muted-foreground mb-6">
            Intenta ajustar tus filtros de búsqueda o explorar otras categorías.
          </p>
          <Button 
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
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-12">
          {paginatedArticles.map((article) => (
            <Card
              key={article.id}
              className="group hover:shadow-lg transition-shadow duration-300 flex flex-col pt-0 pb-6"
            >
              {/* Imagen del artículo */}
              <div className="aspect-video overflow-hidden rounded-t-lg bg-gray-100">
                {article.featuredImage?.url ? (
                  <img
                    src={getStrapiMedia(article.featuredImage.url)}
                    alt={article.featuredImage.alternativeText || article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">Sin imagen</span>
                  </div>
                )}
              </div>

              <CardHeader className="pb-3 flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {article.time || calculateReadTime(article.content)} min
                  </div>
                </div>

                <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">
                  {article.title}
                </CardTitle>
                <CardDescription className="text-sm line-clamp-3">
                  {article.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0 mt-auto">
                {/* Información del autor y fecha */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Avatar className="size-6">
                      <AvatarImage 
                        src={getStrapiMedia(article.author?.image?.url)} 
                        alt={article.author?.fullName}
                      />
                      <AvatarFallback className="text-xs">
                        {getInitials(article.author?.fullName || "A")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground truncate">
                      {article.author?.fullName || "Autor"}
                    </span>
                  </div>

                  <div className="flex items-center text-xs text-muted-foreground">
                    <CalendarDays className="h-3 w-3 mr-1" />
                    {formatDate(article.publishedAt)}
                  </div>
                </div>

                {/* Tags */}
                {article.contentTags && article.contentTags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {article.contentTags.slice(0, 2).map((tag:any) => (
                      <Badge key={tag.id} variant="outline" className="text-xs px-2 py-0">
                        {tag.title}
                      </Badge>
                    ))}
                    {article.contentTags.length > 2 && (
                      <Badge variant="outline" className="text-xs px-2 py-0">
                        +{article.contentTags.length - 2}
                      </Badge>
                    )}
                  </div>
                )}

                {/* Botón de leer más */}
                <Button asChild size="sm" className="w-full">
                  <Link href={`/blog/${article.slug}`}>
                    Leer más
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              // Mostrar solo páginas relevantes para evitar UI abarrotada
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className="w-10"
                  >
                    {page}
                  </Button>
                )
              } else if (
                page === currentPage - 2 ||
                page === currentPage + 2
              ) {
                return (
                  <span key={page} className="px-2 text-muted-foreground">
                    ...
                  </span>
                )
              }
              return null
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Siguiente
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}