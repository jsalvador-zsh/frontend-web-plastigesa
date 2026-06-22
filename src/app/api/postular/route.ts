// app/api/postular/route.ts — Recibe la postulación, valida y la guarda en Strapi
// usando el token del servidor (el rol Public de Strapi permanece cerrado).
import { NextResponse } from "next/server"

export const runtime = "nodejs"

const STRAPI_URL = process.env.STRAPI_URL
// Token con permiso de escritura (Full Access o custom con application.create + upload).
// Si no se define, cae al token general (debe entonces tener permisos de escritura).
const STRAPI_TOKEN = process.env.STRAPI_WRITE_TOKEN || process.env.STRAPI_TOKEN

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB
const ACCEPTED = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]

export async function POST(req: Request) {
  if (!STRAPI_URL || !STRAPI_TOKEN) {
    return NextResponse.json({ error: "Servicio no configurado." }, { status: 500 })
  }

  try {
    const form = await req.formData()
    const fullName = String(form.get("fullName") ?? "").trim()
    const email = String(form.get("email") ?? "").trim()
    const phone = String(form.get("phone") ?? "").trim()
    const message = String(form.get("message") ?? "").trim()
    const jobId = Number(form.get("jobId"))
    const cv = form.get("cv") as File | null

    // ── Validación servidor ──────────────────────────────────────────────
    if (!fullName || !email) {
      return NextResponse.json({ error: "Nombre y correo son obligatorios." }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Correo electrónico no válido." }, { status: 400 })
    }
    if (!jobId || Number.isNaN(jobId)) {
      return NextResponse.json({ error: "Oferta no válida." }, { status: 400 })
    }
    if (!cv || cv.size === 0) {
      return NextResponse.json({ error: "Adjunta tu CV." }, { status: 400 })
    }
    if (!ACCEPTED.includes(cv.type)) {
      return NextResponse.json({ error: "Formato de CV no válido (PDF o Word)." }, { status: 400 })
    }
    if (cv.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "El CV supera los 5 MB." }, { status: 400 })
    }

    // ── Crear la postulación + subir el CV en una sola petición multipart ──
    const strapiForm = new FormData()
    strapiForm.append(
      "data",
      JSON.stringify({
        fullName,
        email,
        phone: phone || undefined,
        message: message || undefined,
        job: jobId,
        applicationStatus: "Nuevo",
      })
    )
    strapiForm.append("files.cv", cv, cv.name)

    const res = await fetch(`${STRAPI_URL}/api/applications`, {
      method: "POST",
      headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
      body: strapiForm,
    })

    if (!res.ok) {
      const detail = await res.text().catch(() => "")
      console.error("Error creando application en Strapi:", res.status, detail)
      return NextResponse.json(
        { error: "No se pudo registrar tu postulación. Intenta más tarde." },
        { status: 502 }
      )
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Error en /api/postular:", err)
    return NextResponse.json({ error: "Ocurrió un error inesperado." }, { status: 500 })
  }
}
