import { MetadataRoute } from "next"
import { getAllSlugs, getAllPageSlugs, getAllJobSlugs } from "@/lib/strapi"

const BASE_URL = "https://plastigesa.com"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [slugs, pageSlugs, jobSlugs] = await Promise.all([
    getAllSlugs(),
    getAllPageSlugs(),
    getAllJobSlugs(),
  ])

  const blogPosts: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${BASE_URL}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }))

  const dynamicPages: MetadataRoute.Sitemap = pageSlugs.map((slug) => ({
    url: `${BASE_URL}/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }))

  const jobPages: MetadataRoute.Sitemap = jobSlugs.map((slug) => ({
    url: `${BASE_URL}/trabaja-con-nosotros/${slug}`,
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
    {
      url: `${BASE_URL}/trabaja-con-nosotros`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...dynamicPages,
    ...jobPages,
    ...blogPosts,
  ]
}
