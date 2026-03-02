import type { BlockCtaBanner } from "@/types/strapi"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"

export default function CtaBanner({
  heading,
  text,
  primaryLink,
  secondaryLink,
  backgroundStyle,
}: BlockCtaBanner) {
  const bgClass =
    backgroundStyle === "primary"
      ? "bg-primary text-primary-foreground"
      : backgroundStyle === "gradient"
        ? "bg-gradient-to-r from-green-600 to-emerald-500 text-white"
        : "bg-muted"

  const isLight = backgroundStyle === "default"

  return (
    <section className={cn("py-20", bgClass)}>
      <div
        className="container mx-auto px-6 max-w-4xl text-center space-y-6"
        data-aos="fade-up"
        data-aos-duration="1000"
      >
        <h2 className="text-3xl md:text-4xl font-bold">{heading}</h2>
        {text && (
          <p className={cn("text-lg max-w-2xl mx-auto", isLight ? "text-muted-foreground" : "opacity-90")}>
            {text}
          </p>
        )}

        {(primaryLink || secondaryLink) && (
          <div className="flex flex-wrap gap-4 justify-center pt-2">
            {primaryLink && (
              <Button
                asChild
                size="lg"
                variant={isLight ? "default" : "secondary"}
              >
                <Link
                  href={primaryLink.href}
                  target={primaryLink.isExternal ? "_blank" : "_self"}
                  rel={primaryLink.isExternal ? "noopener noreferrer" : undefined}
                >
                  {primaryLink.label}
                </Link>
              </Button>
            )}
            {secondaryLink && (
              <Button
                asChild
                size="lg"
                variant={isLight ? "outline" : "outline"}
                className={!isLight ? "border-white text-white hover:bg-white/10" : ""}
              >
                <Link
                  href={secondaryLink.href}
                  target={secondaryLink.isExternal ? "_blank" : "_self"}
                  rel={secondaryLink.isExternal ? "noopener noreferrer" : undefined}
                >
                  {secondaryLink.label}
                </Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
