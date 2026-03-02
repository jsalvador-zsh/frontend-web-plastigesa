import { BlockSectionHeader } from "@/types/strapi"


interface Props extends BlockSectionHeader { }

export default function SectionHeader(props: BlockSectionHeader) {
  const { id, heading, subheading, badge, anchorLink } = props
  return (
    <section id={anchorLink?.href ?? ''} key={id} className="py-12 text-center space-y-4" data-aos="fade-down" data-aos-duration="1500">
      <div className="container mx-auto p-6 max-w-6xl">
        {badge && (
          <span className="text-sm uppercase tracking-widest text-green-600 font-bold">
            {badge}
          </span>
        )}
        <h2 className="text-4xl md:text-5xl font-bold">{heading}</h2>
        <p className="text-lg text-muted-foreground whitespace-pre-line">{subheading}</p>
      </div>

    </section>
  )
}
