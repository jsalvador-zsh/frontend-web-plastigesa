import { Button } from "@/components/ui/button"
import { SearchX } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="text-center space-y-6 max-w-md">
        <SearchX className="h-16 w-16 text-muted-foreground mx-auto" />
        <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
        <h2 className="text-2xl font-semibold">Página no encontrada</h2>
        <p className="text-muted-foreground">
          La página que buscás no existe o fue movida a otra dirección.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild>
            <Link href="/">Ir al inicio</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/blog">Ver el blog</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
