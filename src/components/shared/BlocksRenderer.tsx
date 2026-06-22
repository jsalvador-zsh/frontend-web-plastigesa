// components/shared/BlocksRenderer.tsx
// Renderer ligero para el formato "blocks" de Strapi (campos tipo blocks / rich-text).
// Reutilizado por RichTextBlock y por los requisitos de las ofertas de empleo.
import React from "react"
import type { RichText } from "@/types/strapi"

type Child = {
  text?: string
  type?: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  url?: string
  children?: Child[]
}

function renderChildren(children: Child[] = []): React.ReactNode {
  return children.map((child, i) => {
    if (child.type === "link" && child.url) {
      return (
        <a
          key={i}
          href={child.url}
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          {renderChildren(child.children)}
        </a>
      )
    }

    let node: React.ReactNode = child.text ?? ""
    if (!child.text && child.children) node = renderChildren(child.children)
    if (child.bold) node = <strong key={`b${i}`}>{node}</strong>
    if (child.italic) node = <em key={`i${i}`}>{node}</em>
    if (child.underline) node = <u key={`u${i}`}>{node}</u>
    return <React.Fragment key={i}>{node}</React.Fragment>
  })
}

function renderNode(node: RichText & { format?: string; level?: number }, index: number): React.ReactNode {
  const children = (node as { children?: Child[] }).children ?? []

  switch (node.type) {
    case "heading": {
      const level = node.level ?? 2
      const Tag = (`h${Math.min(Math.max(level, 1), 6)}`) as keyof React.JSX.IntrinsicElements
      return <Tag key={index}>{renderChildren(children)}</Tag>
    }
    case "list": {
      const ordered = node.format === "ordered"
      const ListTag = ordered ? "ol" : "ul"
      return (
        <ListTag key={index} className={ordered ? "list-decimal pl-6" : "list-disc pl-6"}>
          {children.map((item, i) => (
            <li key={i}>{renderChildren(item.children)}</li>
          ))}
        </ListTag>
      )
    }
    case "quote":
      return <blockquote key={index}>{renderChildren(children)}</blockquote>
    case "paragraph":
    default:
      return <p key={index}>{renderChildren(children)}</p>
  }
}

interface Props {
  content?: RichText[]
  className?: string
}

export default function BlocksRenderer({ content, className }: Props) {
  if (!content?.length) return null
  return (
    <div
      className={
        className ??
        "prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-foreground prose-li:text-foreground prose-blockquote:text-muted-foreground"
      }
    >
      {content.map((node, index) => renderNode(node as RichText & { format?: string; level?: number }, index))}
    </div>
  )
}
