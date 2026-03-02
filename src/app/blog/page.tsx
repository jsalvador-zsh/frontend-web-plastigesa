// app/blog/page.tsx
import { Suspense } from "react"
import { Metadata } from "next"
import { getAllArticlesNoPagination } from "@/lib/strapi"
import BlogPageClient from "@/components/shared/BlogPageClient"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata: Metadata = {
  title: "Blog - Plastigesa",
  description: "Descubre artículos sobre productos plásticos industriales, agricultura y más. Mantente actualizado con las últimas tendencias y consejos de la industria.",
  openGraph: {
    title: "Blog - Plastigesa",
    description: "Descubre artículos sobre productos plásticos industriales, agricultura y más.",
    type: "website",
  }
}

interface BlogPageProps {
  searchParams: Promise<{
    page?: string
    category?: string
    search?: string
  }>
}

// Loading component
function BlogPageSkeleton() {
  return (
    <div className="container max-w-6xl mx-auto p-6">
      <div className="text-center mb-12">
        <Skeleton className="h-12 w-64 mx-auto mb-4" />
        <Skeleton className="h-6 w-96 mx-auto" />
      </div>
      
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="border rounded-lg p-6">
            <Skeleton className="aspect-video mb-4" />
            <Skeleton className="h-6 mb-2" />
            <Skeleton className="h-4 mb-4" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams
  const page = parseInt(params.page || '1', 10)
  const category = params.category
  const search = params.search
  
  // Obtener todos los artículos desde Strapi
  const articles = await getAllArticlesNoPagination()
  
  return (
    <main className="min-h-screen bg-background">
      <Suspense fallback={<BlogPageSkeleton />}>
        <BlogPageClient 
          articles={articles}
          initialPage={page}
          initialCategory={category}
          initialSearch={search}
        />
      </Suspense>
    </main>
  )
}