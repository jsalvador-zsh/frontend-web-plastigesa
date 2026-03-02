"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export default function GlobalError({
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
        <h1 className="text-3xl font-bold">Algo salió mal</h1>
        <p className="text-muted-foreground">
          Ocurrió un error inesperado. Por favor, intentá de nuevo o volvé al inicio.
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={reset}>Intentar de nuevo</Button>
          <Button variant="outline" asChild>
            <a href="/">Ir al inicio</a>
          </Button>
        </div>
      </div>
    </main>
  )
}
