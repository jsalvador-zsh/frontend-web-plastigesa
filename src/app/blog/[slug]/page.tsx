// app/blog/[slug]/page.tsx
import { notFound } from "next/navigation"
import { getArticleBySlug, getAllSlugs, getStrapiMedia } from "@/lib/strapi"
import { Metadata } from "next"
import BlogArticleClient from "@/components/shared/BlogArticleClient"

export async function generateStaticParams() {
  const slugs = await getAllSlugs()
  return slugs.map((slug: string) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) return {}

  return {
    title: article.title,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
      publishedTime: article.publishedAt,
      authors: [article.author?.fullName || 'Autor'],
      images: article.featuredImage?.url ? [getStrapiMedia(article.featuredImage.url)] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
      images: article.featuredImage?.url ? [getStrapiMedia(article.featuredImage.url)] : [],
    }
  }
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)

  if (!article) return notFound()

  return <BlogArticleClient article={article} />
}