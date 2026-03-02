import { BlockContentWithImage } from "@/types/strapi"
import { getStrapiMedia } from "@/lib/strapi";
import Image from "next/image";

interface Props extends BlockContentWithImage { }

export default function ContentWithImage({
  heading,
  text,
  reversed,
  image,
}: Props) {
  return (
    <section className="p-4 text-center space-y-4">
      <div
        className={`container mx-auto p-6 max-w-6xl grid md:grid-cols-2 gap-12 items-center ${reversed ? "md:flex-row-reverse" : ""}`}
      >
        <div className="text-center md:text-left" data-aos="fade-right"
              data-aos-duration="1500">
          <h3 className="text-3xl font-semibold mb-4 text-pretty">{heading}</h3>
          <div className="text-muted-foreground space-y-4">
            {text.map((block, index) =>
              block.type === "paragraph" ? (
                <p className="text-pretty" key={index}>{block.children.map(c => c.text).join("")}</p>
              ) : null
            )}
          </div>
        </div>
        <div className="relative" data-aos="fade-left"
              data-aos-duration="1500">
          <Image
            src={getStrapiMedia(image?.url)}
            alt="Imagen"
            width={300}
            height={200}
            className="w-full h-auto object-cover rounded-lg shadow-lg"
          />
        </div>
      </div>
    </section>
  )
}
