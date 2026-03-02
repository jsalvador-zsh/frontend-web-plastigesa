'use client'

import { useEffect, useRef } from 'react'

export default function Map() {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadLeaflet = async () => {
      if (!mapRef.current) return

      if ((window as any).L && mapRef.current.dataset.initialized) return
      mapRef.current.dataset.initialized = 'true'

      const leafletCssId = 'leaflet-css'
      if (!document.getElementById(leafletCssId)) {
        const link = document.createElement('link')
        link.id = leafletCssId
        link.rel = 'stylesheet'
        link.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css'
        document.head.appendChild(link)
      }

      const leafletJsId = 'leaflet-js'
      if (!document.getElementById(leafletJsId)) {
        const script = document.createElement('script')
        script.id = leafletJsId
        script.src = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.js'
        script.onload = initializeMap
        document.body.appendChild(script)
      } else {
        initializeMap()
      }
    }

    const initializeMap = () => {
      const L = (window as any).L
      if (!L || !mapRef.current) return

      const map = L.map(mapRef.current)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map)

      const icon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        iconRetinaUrl:
          'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
        shadowUrl:
          'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      })

      // Coordenadas de ambas sucursales
      const coords = [
        { lat: -16.4054279, lng: -71.5128487, label: 'Plastigesa - Tda. Simón Bolivar' },
        { lat: -16.4202853, lng: -71.5148345, label: 'Plastigesa - Tda. Pedro P. Díaz' },
      ]

      const bounds = L.latLngBounds([])

      coords.forEach(({ lat, lng, label }) => {
        const marker = L.marker([lat, lng], { icon }).addTo(map)
        marker.bindPopup(label).openPopup()
        bounds.extend([lat, lng])
      })

      map.fitBounds(bounds, { padding: [50, 50] })
    }

    loadLeaflet()
  }, [])

  return (
    <div
      ref={mapRef}
      id="map"
      className="h-72 lg:h-[400px] w-full rounded-lg shadow-md"
    />
  )
}
