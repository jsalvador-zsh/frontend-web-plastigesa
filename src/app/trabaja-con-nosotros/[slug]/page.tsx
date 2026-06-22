// app/trabaja-con-nosotros/[slug]/page.tsx — Detalle de una oferta laboral.
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, MapPin, Clock, Building2 } from "lucide-react"
import { getAllJobSlugs, getJobBySlug } from "@/lib/strapi"
import type { Job } from "@/types/strapi"
import BlocksRenderer from "@/components/shared/BlocksRenderer"
import { JobPostingJsonLd } from "@/components/JsonLd"
import { Badge } from "@/components/ui/badge"
import JobApplicationForm from "@/components/recruitment/JobApplicationForm"

const BASE_URL = "https://plastigesa.com"

export const revalidate = 60

export async function generateStaticParams() {
  const slugs = await getAllJobSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const job: Job | null = await getJobBySlug(slug)
  if (!job) return {}

  const title = `${job.position} | Empleo en Plastigesa, Arequipa`
  const description =
    job.description ??
    `Vacante de ${job.position} en Plastigesa, Arequipa. Postula y envía tu CV.`

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}/trabaja-con-nosotros/${job.slug}`,
    },
    openGraph: {
      url: `${BASE_URL}/trabaja-con-nosotros/${job.slug}`,
      title,
      description,
      type: "article",
    },
  }
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const job: Job | null = await getJobBySlug(slug)

  if (!job) return notFound()

  return (
    <main className="container mx-auto px-6 py-12 max-w-3xl">
      <JobPostingJsonLd job={job} />

      <Link
        href="/trabaja-con-nosotros"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a ofertas
      </Link>

      <article>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{job.position}</h1>

        <div className="flex flex-wrap gap-2 mb-8">
          {job.departament && (
            <Badge variant="secondary">
              <Building2 className="w-3 h-3 mr-1" />
              {job.departament}
            </Badge>
          )}
          {job.place && (
            <Badge variant="outline">
              <MapPin className="w-3 h-3 mr-1" />
              {job.place}
            </Badge>
          )}
          {job.time && (
            <Badge variant="outline">
              <Clock className="w-3 h-3 mr-1" />
              {job.time}
            </Badge>
          )}
        </div>

        {job.description && (
          <p className="text-lg text-muted-foreground mb-8 whitespace-pre-line">
            {job.description}
          </p>
        )}

        {job.requirements?.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Requisitos</h2>
            <BlocksRenderer content={job.requirements} />
          </section>
        )}
      </article>

      <section className="border-t pt-10">
        <h2 className="text-2xl font-semibold mb-2">Postula a esta vacante</h2>
        <p className="text-muted-foreground mb-6">
          Completa el formulario y adjunta tu CV (PDF o Word). Nos pondremos en
          contacto contigo.
        </p>
        <JobApplicationForm jobId={job.id} jobPosition={job.position} />
      </section>
    </main>
  )
}
