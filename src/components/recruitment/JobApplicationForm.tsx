"use client"

import { useRef, useState } from "react"
import { Loader2, CheckCircle2, AlertCircle, UploadCloud } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB
const ACCEPTED = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]

interface Props {
  jobId: number
  jobPosition: string
}

export default function JobApplicationForm({ jobId, jobPosition }: Props) {
  const formRef = useRef<HTMLFormElement>(null)
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [error, setError] = useState<string>("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")

    const form = e.currentTarget
    const fd = new FormData(form)
    const file = fd.get("cv") as File | null

    if (!file || file.size === 0) {
      setError("Adjunta tu CV en formato PDF o Word.")
      return
    }
    if (!ACCEPTED.includes(file.type)) {
      setError("Formato no válido. Solo se aceptan archivos PDF, DOC o DOCX.")
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      setError("El archivo supera el tamaño máximo de 5 MB.")
      return
    }

    fd.append("jobId", String(jobId))

    setStatus("loading")
    try {
      const res = await fetch("/api/postular", { method: "POST", body: fd })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || "No se pudo enviar la postulación.")
      }
      setStatus("success")
      form.reset()
    } catch (err) {
      setStatus("error")
      setError(err instanceof Error ? err.message : "Ocurrió un error inesperado.")
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-6 text-center">
        <CheckCircle2 className="w-10 h-10 mx-auto mb-3 text-green-600" />
        <h3 className="font-semibold text-lg">¡Postulación enviada!</h3>
        <p className="text-muted-foreground mt-1">
          Gracias por postular a <strong>{jobPosition}</strong>. Revisaremos tu CV
          y te contactaremos si tu perfil encaja.
        </p>
      </div>
    )
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-2">
        <Label htmlFor="fullName">Nombre completo *</Label>
        <Input id="fullName" name="fullName" required autoComplete="name" />
      </div>

      <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Correo electrónico *</Label>
          <Input id="email" name="email" type="email" required autoComplete="email" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="phone">Teléfono</Label>
          <Input id="phone" name="phone" type="tel" autoComplete="tel" />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="message">Mensaje (opcional)</Label>
        <Textarea id="message" name="message" rows={4} placeholder="Cuéntanos por qué eres la persona ideal para este puesto." />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="cv">Adjunta tu CV (PDF o Word, máx. 5 MB) *</Label>
        <div className="flex items-center gap-2 rounded-md border border-input p-2">
          <UploadCloud className="w-5 h-5 text-muted-foreground shrink-0" />
          <Input
            id="cv"
            name="cv"
            type="file"
            required
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="border-0 p-0 shadow-none file:mr-3 file:rounded file:border-0 file:bg-muted file:px-3 file:py-1 file:text-sm"
          />
        </div>
      </div>

      {error && (
        <p className="flex items-center gap-2 text-sm text-red-600">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}

      <Button type="submit" disabled={status === "loading"} className="w-full sm:w-auto">
        {status === "loading" ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Enviando…
          </>
        ) : (
          "Enviar postulación"
        )}
      </Button>
    </form>
  )
}
