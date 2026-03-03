import { MetadataRoute } from "next"
import { getAllSlugs } from "@/lib/strapi"

const BASE_URL = "https://plastigesa.com"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getAllSlugs()

  const blogPosts: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${BASE_URL}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }))

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...blogPosts,
  ]
}
