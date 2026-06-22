import type { Job } from "@/types/strapi"

export function JobPostingJsonLd({ job }: { job: Job }) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.position,
    description: job.description ?? job.position,
    datePosted: job.publishedAt,
    employmentType: job.employmentType ?? "FULL_TIME",
    hiringOrganization: {
      "@type": "Organization",
      name: "Plastigesa",
      sameAs: "https://plastigesa.com",
      logo: "https://plastigesa.com/favicon.svg",
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.place ?? "Arequipa",
        addressRegion: "Arequipa",
        addressCountry: "PE",
      },
    },
  }

  if (job.validThrough) schema.validThrough = job.validThrough
  if (job.salaryMin || job.salaryMax) {
    schema.baseSalary = {
      "@type": "MonetaryAmount",
      currency: job.currency ?? "PEN",
      value: {
        "@type": "QuantitativeValue",
        minValue: job.salaryMin ?? undefined,
        maxValue: job.salaryMax ?? undefined,
        unitText: "MONTH",
      },
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function OrganizationJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    name: "Plastigesa",
    url: "https://plastigesa.com",
    logo: "https://plastigesa.com/favicon.svg",
    image: "https://plastigesa.com/screenshot-web.png",
    description:
      "Empresa familiar 100% peruana especialista en producción de empaques flexibles y embalajes de polietileno de alta y baja densidad para industria y agricultura.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Arequipa",
      addressRegion: "Arequipa",
      addressCountry: "PE",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: "Spanish",
    },
    sameAs: [],
    "@id": "https://plastigesa.com/#organization",
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
