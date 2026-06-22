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

    // Strapi v5 no parsea el `data` JSON de un multipart en content-API, así que
    // se hace en 2 pasos: 1) crear la entrada con JSON, 2) subir el CV y enlazarlo.
    const authHeader = { Authorization: `Bearer ${STRAPI_TOKEN}` }

    // ── Paso 1: crear la postulación ──────────────────────────────────────
    const createRes = await fetch(`${STRAPI_URL}/api/applications`, {
      method: "POST",
      headers: { ...authHeader, "Content-Type": "application/json" },
      body: JSON.stringify({
        data: {
          fullName,
          email,
          phone: phone || undefined,
          message: message || undefined,
          job: jobId,
          applicationStatus: "Nuevo",
        },
      }),
    })

    if (!createRes.ok) {
      const detail = await createRes.text().catch(() => "")
      console.error("Error creando application en Strapi:", createRes.status, detail)
      return NextResponse.json(
        { error: "No se pudo registrar tu postulación. Intenta más tarde." },
        { status: 502 }
      )
    }

    const created = await createRes.json()
    const appId = created?.data?.id

    // ── Paso 2: subir el CV y enlazarlo al campo `cv` de la postulación ────
    const uploadForm = new FormData()
    uploadForm.append("ref", "api::application.application")
    uploadForm.append("refId", String(appId))
    uploadForm.append("field", "cv")
    uploadForm.append("files", cv, cv.name)

    const uploadRes = await fetch(`${STRAPI_URL}/api/upload`, {
      method: "POST",
      headers: authHeader,
      body: uploadForm,
    })

    if (!uploadRes.ok) {
      // La postulación quedó creada aunque el CV falle; lo registramos y avisamos.
      const detail = await uploadRes.text().catch(() => "")
      console.error("Error subiendo el CV en Strapi:", uploadRes.status, detail)
      return NextResponse.json(
        { error: "Registramos tus datos, pero no se pudo adjuntar el CV. Intenta de nuevo." },
        { status: 502 }
      )
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Error en /api/postular:", err)
    return NextResponse.json({ error: "Ocurrió un error inesperado." }, { status: 500 })
  }
}
