import { Button } from "@/components/ui/button"
import { FileQuestion } from "lucide-react"
import Link from "next/link"

export default function ArticleNotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="text-center space-y-6 max-w-md">
        <FileQuestion className="h-16 w-16 text-muted-foreground mx-auto" />
        <h1 className="text-2xl font-bold">Artículo no encontrado</h1>
        <p className="text-muted-foreground">
          El artículo que buscás no existe, fue eliminado o la URL es incorrecta.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild>
            <Link href="/blog">Ver todos los artículos</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Ir al inicio</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
