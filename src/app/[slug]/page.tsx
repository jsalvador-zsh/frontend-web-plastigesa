// app/[slug]/page.tsx — Páginas dinámicas gestionadas desde el collection type `page` de Strapi.
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getAllPageSlugs, getPageBySlug } from "@/lib/strapi"
import DynamicZone from "@/components/DynamicZone"

const BASE_URL = "https://plastigesa.com"

export const revalidate = 60

export async function generateStaticParams() {
  const slugs = await getAllPageSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const page = await getPageBySlug(slug)
  if (!page) return {}

  return {
    title: page.title,
    description: page.description ?? undefined,
    alternates: {
      canonical: `${BASE_URL}/${page.slug}`,
    },
    openGraph: {
      url: `${BASE_URL}/${page.slug}`,
      title: page.title,
      description: page.description ?? undefined,
    },
  }
}

export default async function DynamicPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const page = await getPageBySlug(slug)

  if (!page) return notFound()

  return (
    <main>
      <DynamicZone blocks={page.blocks ?? []} />
    </main>
  )
}
