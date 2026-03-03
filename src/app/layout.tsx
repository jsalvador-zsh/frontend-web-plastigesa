import type { Metadata } from "next"
import "@fontsource-variable/geist"
import "./globals.css"
import Header from "@/components/layout/Header"
// import Banner from "@/components/layout/Banner"
import Footer from "@/components/layout/Footer"
import { fetchGlobalData } from "@/lib/strapi"
import Script from "next/script"

import { AOSInitializer } from "@/components/AOSInitializer"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { OrganizationJsonLd } from "@/components/JsonLd"

const BASE_URL = "https://plastigesa.com"

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Plastigesa | Empaques Flexibles y Embalajes en Arequipa, Perú",
    template: "%s | Plastigesa",
  },
  description:
    "Plastigesa es una empresa familiar 100% peruana con sede en Arequipa. Especialistas en producción de empaques flexibles, embalajes de polietileno de alta y baja densidad para industria y agricultura.",
  keywords: [
    "empaques flexibles",
    "embalajes plásticos",
    "polietileno",
    "bolsas industriales",
    "mangas de polietileno",
    "film stretch",
    "empaques para agricultura",
    "empaques Arequipa",
    "embalajes Perú",
    "Plastigesa",
    "plásticos industriales",
    "empaques biodegradables",
    "sacos de polipropileno",
  ],
  authors: [{ name: "Plastigesa", url: BASE_URL }],
  creator: "Plastigesa",
  publisher: "Plastigesa",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
    languages: {
      "es-PE": BASE_URL,
    },
  },
  openGraph: {
    type: "website",
    locale: "es_PE",
    url: BASE_URL,
    siteName: "Plastigesa",
    title: "Plastigesa | Empaques Flexibles y Embalajes en Arequipa, Perú",
    description:
      "Empresa peruana especialista en empaques flexibles, embalajes de polietileno de alta y baja densidad para industria y agricultura. Con sede en Arequipa.",
    images: [
      {
        url: "/screenshot-web.png",
        width: 1200,
        height: 630,
        alt: "Plastigesa - Empaques Flexibles y Embalajes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Plastigesa | Empaques Flexibles y Embalajes en Arequipa, Perú",
    description:
      "Empresa peruana especialista en empaques flexibles y embalajes de polietileno para industria y agricultura.",
    images: ["/screenshot-web.png"],
  },
  verification: {
    google: "-FTSnpKg_WNEIbuIoWn9FhPc-wEHaCdrFDt3ortr33g",
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const globalData = await fetchGlobalData()

  return (
    <html lang="es">
      <head>
        <link rel="stylesheet" href="https://unpkg.com/aos@next/dist/aos.css" />
        <link rel="icon" type="image/x-icon" href="/favicon.svg" />
        <meta httpEquiv="Permissions-Policy" content="fullscreen=(self)" />
        <OrganizationJsonLd />
      </head>
      <body className="pt-16">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AOSInitializer />
          {/* <Banner data={globalData.banner} /> */}
          <Header data={globalData.header} />
          {children}
          <Footer data={globalData.footer} />
        </ThemeProvider>
        <Script
          id="chatwoot"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
  window.chatwootSettings = {"position":"right","type":"expanded_bubble","launcherTitle":"Conversa con nosotros"};
  (function(d,t) {
    var BASE_URL="https://chat.plastigesa.org";
    var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
    g.src=BASE_URL+"/packs/js/sdk.js";
    g.async = true;
    s.parentNode.insertBefore(g,s);
    g.onload=function(){
      window.chatwootSDK.run({
        websiteToken: 'tjAMFgBHPhMwoZHXTfXGAKFv',
        baseUrl: BASE_URL
      })
    }
  })(document,"script");
            `
          }}
        />

      </body>
    </html>
  )
}
