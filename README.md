# Plastigesa EIRL - Sitio Web Corporativo

Este proyecto fue desarrollado para **Plastigesa EIRL**, una empresa peruana especializada en empaques flexibles y embalajes. El sitio web está construido con tecnologías modernas como **Next.js**, **TypeScript**, **Tailwind CSS**, **Strapi**, y **Framer Motion** para brindar una experiencia fluida, rápida y escalable.

Puedes visitar el sitio en [plastigesa.com](https://plastigesa.com/).

<div align="center">
<a href="https://plastigesa.com/">
<img src="./public/screenshot-web.png" alt="Captura de pantalla del sitio de Plastigesa">
</a>
<p></p>
</div>

<div align="center">

## 📚 Tecnologías Utilizadas

![Next.js](https://img.shields.io/badge/Next.js-000000?logo=nextdotjs\&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB.svg?logo=react\&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6.svg?logo=typescript\&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4.svg?logo=tailwindcss\&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF.svg?logo=framer\&logoColor=white)
![Strapi](https://img.shields.io/badge/Strapi-2E2E3E.svg?logo=strapi\&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-f9ad00?logo=pnpm\&logoColor=f9ad00\&color=gray)

</div>

## 🚀 Características Principales

* Diseño atractivo, moderno y responsive
* Arquitectura Jamstack con consumo desde Strapi
* Animaciones con Framer Motion
* Carruseles interactivos con Swiper
* Despliegue automático con Vercel
* Integración con CMS headless para contenido dinámico
* Optimizado para SEO y performance

## 🏗 Estructura del Proyecto

```text
/
├── public/
│   └── favicon.svg
├── src/
│   ├── app/                 # Rutas App Router de Next.js
│   ├── components/          # Componentes reutilizables
│   ├── lib/                 # Funciones de utilidad (fetch, Strapi, etc.)
│   ├── styles/              # Estilos globales (Tailwind)
│   └── types/               # Tipado personalizado (Strapi, etc.)
├── next.config.js           # Configuración de Next.js
├── tailwind.config.ts       # Configuración de Tailwind
├── tsconfig.json            # Configuración de TypeScript
└── package.json             # Dependencias del proyecto
```

## 🦜 Comandos Principales

Desde la raíz del proyecto:

| Comando          | Acción                                               |
| ---------------- | ---------------------------------------------------- |
| `pnpm install`   | Instala todas las dependencias                       |
| `pnpm run dev`   | Inicia el servidor de desarrollo en `localhost:3000` |
| `pnpm run build` | Compila el sitio para producción                     |
| `pnpm run start` | Inicia el servidor en modo producción                |

## 🚧 Despliegue y Actualización Automática

Este proyecto está conectado con Strapi como CMS. Se utiliza un **webhook de Vercel** para desplegar automáticamente el sitio cada vez que se actualiza el contenido desde el panel de Strapi.