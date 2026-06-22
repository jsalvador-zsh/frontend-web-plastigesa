import qs from "qs"

const STRAPI_URL = process.env.STRAPI_URL
const STRAPI_TOKEN = process.env.STRAPI_TOKEN

// ─── Helper base ────────────────────────────────────────────────────────────

async function strapiRequest<T>(
  path: string,
  query?: Record<string, unknown>,
  options?: RequestInit
): Promise<T> {
  const queryString = query ? `?${qs.stringify(query, { encodeValuesOnly: true })}` : ""
  const url = `${STRAPI_URL}/api${path}${queryString}`

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${STRAPI_TOKEN}`,
    },
    ...options,
  })

  if (!res.ok) {
    throw new Error(`Strapi error ${res.status} en ${path}: ${res.statusText}`)
  }

  return res.json()
}

// ─── Utilidad de media ───────────────────────────────────────────────────────

export function getStrapiMedia(url?: string): string {
  const base = process.env.NEXT_PUBLIC_STRAPI_URL
  if (!url || !base) return "/placeholder.svg"
  return url.startsWith("/") ? `${base}${url}` : url
}

// ─── Global (header, footer, banner) ────────────────────────────────────────

export async function fetchGlobalData() {
  const data = await strapiRequest<{ data: unknown }>("/global")
  return (data as any).data
}

// ─── Landing page ────────────────────────────────────────────────────────────

export async function fetchLandingPage() {
  const data = await strapiRequest<{ data: unknown }>("/landing-page")
  return (data as any).data
}

// ─── Páginas dinámicas ─────────────────────────────────────────────────────

export async function getAllPageSlugs(): Promise<string[]> {
  try {
    const data = await strapiRequest<{ data: { slug: string }[] }>(
      "/pages",
      { fields: ["slug"], "pagination[pageSize]": 1000 },
      { next: { revalidate: 60 } }
    )
    return data.data.map((item) => item.slug).filter(Boolean)
  } catch (error) {
    console.error("Error en getAllPageSlugs:", error)
    return []
  }
}

export async function getPageBySlug(slug: string) {
  try {
    // El middleware `page-populate` inyecta el populate de los bloques en find.
    const data = await strapiRequest<{ data: any[] }>(
      "/pages",
      { filters: { slug: { $eq: slug } } },
      { next: { revalidate: 60 } }
    )
    return data.data?.[0] ?? null
  } catch (error) {
    console.error("Error en getPageBySlug:", error)
    return null
  }
}

// ─── Empleos / Reclutamiento ────────────────────────────────────────────────

export async function getAllJobs() {
  try {
    // El middleware `job-populate` inyecta el populate (requirements, link) en find.
    const data = await strapiRequest<{ data: any[] }>(
      "/jobs",
      {
        filters: { statusJob: { $eq: "Disponible" } },
        sort: "publishedAt:desc",
        "pagination[pageSize]": 100,
      },
      { next: { revalidate: 60 } }
    )
    return data.data ?? []
  } catch (error) {
    console.error("Error en getAllJobs:", error)
    return []
  }
}

export async function getAllJobSlugs(): Promise<string[]> {
  try {
    const data = await strapiRequest<{ data: { slug: string }[] }>(
      "/jobs",
      {
        filters: { statusJob: { $eq: "Disponible" } },
        fields: ["slug"],
        "pagination[pageSize]": 1000,
      },
      { next: { revalidate: 60 } }
    )
    return data.data.map((item) => item.slug).filter(Boolean)
  } catch (error) {
    console.error("Error en getAllJobSlugs:", error)
    return []
  }
}

export async function getJobBySlug(slug: string) {
  try {
    const data = await strapiRequest<{ data: any[] }>(
      "/jobs",
      { filters: { slug: { $eq: slug } } },
      { next: { revalidate: 60 } }
    )
    return data.data?.[0] ?? null
  } catch (error) {
    console.error("Error en getJobBySlug:", error)
    return null
  }
}

// ─── Artículos ───────────────────────────────────────────────────────────────

const ARTICLE_POPULATE = {
  populate: {
    author: { populate: { image: { fields: ["url", "alternativeText"] } } },
    contentTags: { fields: ["id", "title", "description"] },
    featuredImage: { fields: ["url", "alternativeText"] },
  },
}

export async function getAllSlugs(): Promise<string[]> {
  try {
    const data = await strapiRequest<{ data: { slug: string }[] }>(
      "/articles",
      { fields: ["slug"], "pagination[pageSize]": 1000 },
      { next: { revalidate: 60 } }
    )
    return data.data.map((item) => item.slug)
  } catch (error) {
    console.error("Error en getAllSlugs:", error)
    return []
  }
}

export async function getArticleBySlug(slug: string) {
  try {
    const data = await strapiRequest<{ data: any[] }>(
      "/articles",
      {
        filters: { slug: { $eq: slug } },
        ...ARTICLE_POPULATE,
      },
      { next: { revalidate: 60 } }
    )
    const item = data.data?.[0]
    if (!item) return null
    return item
  } catch (error) {
    console.error("Error en getArticleBySlug:", error)
    return null
  }
}

export async function getAllArticles(page = 1, pageSize = 25) {
  try {
    const data = await strapiRequest<{ data: any[]; meta: any }>(
      "/articles",
      {
        ...ARTICLE_POPULATE,
        sort: "publishedAt:desc",
        pagination: { page, pageSize },
      },
      { next: { revalidate: 60 } }
    )
    return { data: data.data ?? [], meta: data.meta ?? {} }
  } catch (error) {
    console.error("Error en getAllArticles:", error)
    return { data: [], meta: {} }
  }
}

export async function getAllArticlesNoPagination() {
  try {
    const data = await strapiRequest<{ data: any[] }>(
      "/articles",
      {
        ...ARTICLE_POPULATE,
        sort: "publishedAt:desc",
        "pagination[pageSize]": 100,
      },
      { next: { revalidate: 60 } }
    )
    return data.data ?? []
  } catch (error) {
    console.error("Error en getAllArticlesNoPagination:", error)
    return []
  }
}

export async function getArticlesByCategory(category: string, page = 1, pageSize = 6) {
  try {
    const data = await strapiRequest<{ data: any[]; meta: any }>(
      "/articles",
      {
        filters: { contentTags: { title: { $eq: category } } },
        ...ARTICLE_POPULATE,
        sort: "publishedAt:desc",
        pagination: { page, pageSize },
      },
      { next: { revalidate: 60 } }
    )
    return { data: data.data ?? [], meta: data.meta ?? {} }
  } catch (error) {
    console.error("Error en getArticlesByCategory:", error)
    return { data: [], meta: {} }
  }
}

export async function searchArticles(query: string, page = 1, pageSize = 6) {
  try {
    const data = await strapiRequest<{ data: any[]; meta: any }>(
      "/articles",
      {
        filters: {
          $or: [
            { title: { $containsi: query } },
            { description: { $containsi: query } },
          ],
        },
        ...ARTICLE_POPULATE,
        sort: "publishedAt:desc",
        pagination: { page, pageSize },
      },
      { next: { revalidate: 60 } }
    )
    return { data: data.data ?? [], meta: data.meta ?? {} }
  } catch (error) {
    console.error("Error en searchArticles:", error)
    return { data: [], meta: {} }
  }
}
