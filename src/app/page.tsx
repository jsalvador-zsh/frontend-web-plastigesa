import { fetchLandingPage } from "@/lib/strapi"
import DynamicZone from "@/components/DynamicZone"
import {Contact2} from "@/components/blocks/ContactInfo"

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
