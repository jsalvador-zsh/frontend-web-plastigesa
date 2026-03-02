// components/DynamicZone.tsx
import { DynamicBlock } from "@/types/strapi"
import HeroBlock from "@/components/blocks/HeroBlock"
import SectionHeader from "@/components/blocks/SectionHeader"
import ContentWithVideo from "@/components/blocks/ContentWithVideo"
import ContentWithImage from "@/components/blocks/ContentWithImage"
import GridCard from "@/components/blocks/GridCard"
import GridCardImage from "@/components/blocks/GridCardImage"
import BentoGridCard from "@/components/blocks/BentoGridCard"
import FeaturedArticles from "@/components/blocks/FeaturedArticles"
import { MultiRowCarouselBlock } from "@/components/blocks/Carousel"
import { FaqBlock } from "@/components/blocks/FaqBlock"
import TestimonialsBlock from "@/components/blocks/Testimonials"
import CtaBanner from "@/components/blocks/CtaBanner"
import RichTextBlock from "@/components/blocks/RichTextBlock"

interface Props {
  blocks: DynamicBlock[]
}

export default function DynamicZone({ blocks }: Props) {
  return (
    <>
      {blocks.map((block) => {
        switch (block.__component) {
          case "blocks.hero":
            return <HeroBlock key={block.id} {...block} />
          case "blocks.section-header":
            return <SectionHeader key={block.id} {...block} />
          case "blocks.content-with-video":
            return <ContentWithVideo key={block.id} {...block} />
          case "blocks.content-with-image":
            return <ContentWithImage key={block.id} {...block} />
          case "blocks.grid-card":
            return <GridCard key={block.id} {...block} />
          case "blocks.grid-card-image":
            return <GridCardImage key={block.id} {...block} />
          case "blocks.bento-grid-card":
            return <BentoGridCard key={block.id} {...block} />
          case "blocks.carousel":
            return <MultiRowCarouselBlock key={block.id} {...block} />
          case "blocks.faq":
            return <FaqBlock key={block.id} {...block} />
          case "blocks.featured-articles":
            return <FeaturedArticles key={block.id} {...block} />
          case "blocks.testimonials":
            return <TestimonialsBlock key={block.id} {...block} />
          case "blocks.cta-banner":
            return <CtaBanner key={block.id} {...block} />
          case "blocks.rich-text":
            return <RichTextBlock key={block.id} {...block} />
          default:
            return null
        }
      })}
    </>
  )
}
