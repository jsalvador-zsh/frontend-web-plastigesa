import type { BlockRichText, RichText } from "@/types/strapi"

function renderNode(node: RichText, index: number): React.ReactNode {
  const text = node.children.map((child, i) => {
    if (!child.text) return null
    return <span key={i}>{child.text}</span>
  })

  switch (node.type) {
    case "paragraph":
      return <p key={index}>{text}</p>
    case "heading":
      return <h2 key={index}>{text}</h2>
    case "list":
      return <ul key={index} className="list-disc pl-6">{text}</ul>
    case "quote":
      return <blockquote key={index}>{text}</blockquote>
    default:
      return <p key={index}>{text}</p>
  }
}

export default function RichTextBlock({ content }: BlockRichText) {
  if (!content?.length) return null

  return (
    <section className="py-12">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-foreground prose-li:text-foreground prose-blockquote:text-muted-foreground">
          {content.map((node, index) => renderNode(node, index))}
        </div>
      </div>
    </section>
  )
}
