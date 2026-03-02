"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import Link from "next/link"

export default function BlogError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="text-center space-y-6 max-w-md">
        <AlertCircle className="h-16 w-16 text-destructive mx-auto" />
        <h1 className="text-2xl font-bold">Error al cargar el blog</h1>
        <p className="text-muted-foreground">
          No pudimos cargar los artículos. Revisá tu conexión o intentá de nuevo.
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={reset}>Intentar de nuevo</Button>
          <Button variant="outline" asChild>
            <Link href="/">Ir al inicio</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
