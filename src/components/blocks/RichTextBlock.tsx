import type { BlockRichText } from "@/types/strapi"
import BlocksRenderer from "@/components/shared/BlocksRenderer"

export default function RichTextBlock({ content }: BlockRichText) {
  if (!content?.length) return null

  return (
    <section className="py-12">
      <div className="container mx-auto px-6 max-w-4xl">
        <BlocksRenderer content={content} />
      </div>
    </section>
  )
}
