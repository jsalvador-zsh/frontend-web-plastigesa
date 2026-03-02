import { cn } from "@/lib/utils"
import { BlockContentWithVideo } from "@/types/strapi"
import HeroVideoDialog from "@/components/magicui/hero-video-dialog";
import { getStrapiMedia } from "@/lib/strapi";

interface Props extends BlockContentWithVideo { }

export default function ContentWithVideo({
  heading,
  text,
  reversed,
  videoUrl,
  thumbnail,
}: Props) {
  return (
    <section className="py-12 text-center space-y-4">
      <div
        className={`container mx-auto p-6 max-w-6xl grid md:grid-cols-2 gap-12 items-center ${reversed ? "md:flex md:flex-row-reverse" : ""}`}
      >
        <div className="text-center md:text-left flex-1" data-aos="fade-right" data-aos-duration="1500">
          <h3 className="text-3xl font-semibold mb-4 text-pretty">{heading}</h3>
          <div className="text-muted-foreground space-y-4">
            {text.map((block, index) =>
              block.type === "paragraph" ? (
                <p className="text-pretty" key={index}>{block.children.map(c => c.text).join("")}</p>
              ) : null
            )}
          </div>
        </div>
        <div className="relative flex-1" data-aos="fade-left"
          data-aos-duration="1500">
          <HeroVideoDialog
            videoSrc={videoUrl}
            className="block dark:hidden"
            animationStyle="from-center"
            thumbnailSrc={getStrapiMedia(thumbnail?.url)}
            thumbnailAlt="Hero Video"
          />
        </div>
      </div>
    </section>
  )
}
