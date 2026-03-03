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
