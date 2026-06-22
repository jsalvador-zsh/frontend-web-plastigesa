// app/trabaja-con-nosotros/page.tsx — Listado público de ofertas laborales.
import type { Metadata } from "next"
import Link from "next/link"
import { Briefcase, MapPin, Clock, Building2 } from "lucide-react"
import { getAllJobs } from "@/lib/strapi"
import type { Job } from "@/types/strapi"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const BASE_URL = "https://plastigesa.com"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Trabaja con nosotros | Ofertas laborales en Plastigesa, Arequipa",
  description:
    "Únete a Plastigesa. Conoce nuestras ofertas laborales y vacantes disponibles en Arequipa, Perú. Postula y envía tu CV para formar parte de nuestro equipo.",
  alternates: {
    canonical: `${BASE_URL}/trabaja-con-nosotros`,
  },
  openGraph: {
    url: `${BASE_URL}/trabaja-con-nosotros`,
    title: "Trabaja con nosotros | Ofertas laborales en Plastigesa",
    description:
      "Conoce nuestras ofertas laborales y vacantes disponibles en Arequipa, Perú. Postula y envía tu CV.",
  },
}

export default async function JobsPage() {
  const jobs: Job[] = await getAllJobs()

  return (
    <main className="container mx-auto px-6 py-16 max-w-5xl">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Trabaja con nosotros</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Somos una empresa familiar 100% peruana. Descubre nuestras vacantes
          disponibles y postula para formar parte del equipo de Plastigesa.
        </p>
      </header>

      {jobs.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Por el momento no tenemos vacantes disponibles. ¡Vuelve pronto!</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {jobs.map((job) => (
            <Card key={job.id} className="flex flex-col">
              <CardHeader>
                <div className="flex flex-wrap gap-2 mb-2">
                  {job.departament && (
                    <Badge variant="secondary">
                      <Building2 className="w-3 h-3 mr-1" />
                      {job.departament}
                    </Badge>
                  )}
                  {job.time && (
                    <Badge variant="outline">
                      <Clock className="w-3 h-3 mr-1" />
                      {job.time}
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-xl">{job.position}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                {job.place && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {job.place}
                  </p>
                )}
                {job.description && (
                  <p className="mt-3 text-sm line-clamp-3">{job.description}</p>
                )}
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={`/trabaja-con-nosotros/${job.slug}`}>
                    Ver oferta y postular
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </main>
  )
}
