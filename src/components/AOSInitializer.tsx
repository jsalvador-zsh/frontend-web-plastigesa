'use client'

import { useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'

export function AOSInitializer() {
  useEffect(() => {
    AOS.init({
      duration: 400,
      easing: 'ease',
      once: true,
    })
  }, [])

  return null
}
