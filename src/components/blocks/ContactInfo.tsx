'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import Map from '@/components/Map'

interface Contact2Props {
  title?: string
  description?: string
  phone?: string
  email?: string
  web?: { label: string; url: string }
}

const Contact2 = ({
  title = 'Contáctanos',
  description = 'Estamos aquí para ayudarte. Solicita tu cotización personalizada y descubre cómo podemos impulsar tu negocio.',
  phone = '+51 925912560',
  email = 'comercial@plastigesa.com - cotizacion@plastigesa.com',
}: Contact2Props) => {
  return (
    <section className="p-4" id="quotation">
      {/* Mapa */}
      <div className="container mx-auto max-w-6xl px-4 mb-10" data-aos="zoom-in"
              data-aos-duration="1500">
        <Map />
      </div>

      {/* Contenido: Contacto + Formulario */}
      <div className="container mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 items-center gap-12 md:flex md:flex-1/2">
          {/* Información de contacto */}
          <div className="lg:w-1/2 flex flex-col gap-8" data-aos="fade-right"
              data-aos-duration="1500">
            <div>
              <h2 className="text-4xl font-bold mb-4">{title}</h2>
              <p className="text-muted-foreground">{description}</p>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-4">Detalles de contacto</h3>
              <ul className="space-y-2">
                <li>
                  <span className="font-bold">Teléfono: </span>
                  {phone}
                </li>
                <li>
                  <span className="font-bold">Email: </span>
                    {email}
                </li>
              </ul>
            </div>
          </div>

          {/* Formulario */}
          <div className="lg:w-1/2 border rounded-lg p-6 shadow-sm flex flex-col gap-6 text-sm" data-aos="fade-left"
              data-aos-duration="1500">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full">
                <Label htmlFor="firstname" className='mb-1'>Nombres</Label>
                <Input type="text" id="firstname" />
              </div>
              <div className="w-full">
                <Label htmlFor="company" className='mb-1'>Empresa</Label>
                <Input type="text" id="company" />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className='mb-1'>Email</Label>
              <Input type="email" id="email" placeholder="Email" />
            </div>

            <div>
              <Label htmlFor="subject" className='mb-1'>Asunto</Label>
              <Input type="text" id="subject" placeholder="Asunto" />
            </div>

            <div>
              <Label htmlFor="message" className='mb-1'>Mensaje</Label>
              <Textarea id="message" placeholder="Escribe tu mensaje aquí." />
            </div>

            <Button className="w-full">Enviar mensaje</Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export { Contact2 }
