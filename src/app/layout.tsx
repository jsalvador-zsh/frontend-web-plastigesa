import type { Metadata } from "next"
import "@fontsource-variable/geist"
import "./globals.css"
import Header from "@/components/layout/Header"
// import Banner from "@/components/layout/Banner"
import Footer from "@/components/layout/Footer"
import { fetchGlobalData } from "@/lib/strapi"
import Script from "next/script"

import { AOSInitializer } from "@/components/AOSInitializer"

export const metadata: Metadata = {
  title: "Plastigesa",
  description: "Plastigesa es una empresa familiar 100% peruana con sede en Arequipa, especialistas en producción de empaques flexibles y embalajes de alta y baja densidad.",
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
      </head>
      <body>
        <AOSInitializer />
        {/* <Banner data={globalData.banner} /> */}
        <Header data={globalData.header} />
        {children}
        <Footer data={globalData.footer} />
        <Script
          id="chatwoot"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(d,t) {
                  var BASE_URL="https://rq0yds.easypanel.host";
                  var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
                  g.src=BASE_URL+"/packs/js/sdk.js";
                  g.async = true;
                  s.parentNode.insertBefore(g,s);
                  g.onload=function(){
                    window.chatwootSDK.run({
                      websiteToken: 'av7aQB5Gg1mv3Gr4zgHWa8fR',
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
