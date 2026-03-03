import type { Metadata } from "next"
import { fetchLandingPage } from "@/lib/strapi"
import DynamicZone from "@/components/DynamicZone"
import {Contact2} from "@/components/blocks/ContactInfo"

export const metadata: Metadata = {
  title: "Plastigesa | Empaques Flexibles y Embalajes en Arequipa, Perú",
  description:
    "Plastigesa, empresa familiar 100% peruana en Arequipa. Fabricamos empaques flexibles, bolsas y embalajes de polietileno de alta y baja densidad para industria y agricultura.",
  alternates: {
    canonical: "https://plastigesa.com",
  },
  openGraph: {
    url: "https://plastigesa.com",
    title: "Plastigesa | Empaques Flexibles y Embalajes en Arequipa, Perú",
    description:
      "Fabricamos empaques flexibles, bolsas y embalajes de polietileno de alta y baja densidad para industria y agricultura. Empresa 100% peruana en Arequipa.",
  },
}

export default async function LandingPage() {
  const page = await fetchLandingPage()
  const blocks = page?.blocks ?? page?.data?.blocks ?? []

  return (
    <main>
      <DynamicZone blocks={blocks} />
      <Contact2  />
    </main>
  )
}
