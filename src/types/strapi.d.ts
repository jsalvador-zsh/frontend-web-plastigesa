export interface GlobalResponse {
  data: GlobalData
  meta: Record<string, any>
}

export interface GlobalData {
  id: number
  documentId: string
  createdAt: string
  updatedAt: string
  publishedAt: string
  locale: string
  title: string
  description: string
  banner: Banner
  header: Header
  footer: Footer
}

export interface Banner {
  id: number
  label: string
  href: string
  isExternal: boolean
  isVisible: boolean
  badge: string
}

export interface Header {
  id: number
  logo: Logo
  navitems: NavItem[]
  cta: NavItem
}

export interface Footer {
  id: number
  text: string
  logo: Logo
  navitems: NavItem[]
  socialitems: SocialItem[]
}

export interface Logo {
  id: number
  text: string
  href: string
  isExternal: boolean
  hasIcon: boolean
  icon: string | null
  image: Image
}

export interface Image {
  id: number
  documentId: string
  url: string
  alternativeText: string | null
  width?: number
  height?: number
}

export interface RichText {
  type: string
  children: { text: string; type?: string }[]
}

export interface NavItem {
  id: number
  label: string
  href: string
  isButton: boolean
  isExternal: boolean
  isVisible: boolean
  type: 'primary' | 'secondary' | string | null
}

export interface Link {
  id: number
  label: string
  href: string
  isButton: boolean
  isExternal: boolean
  isVisible: boolean
  type: 'primary' | 'secondary' | string | null
}

export interface SocialItem {
  id: number
  text: string
  href: string
  isExternal: boolean
  hasIcon: boolean
  icon: string
}

export interface GridCardItem {
  id: number
  heading: string | null
  text: string
  number: number
  icon: string
  badge: string | null
  image: Image
}

export interface BentoCardItem {
  id: number
  heading: string
  text: string
  badge: string
  sizeCard: null | "small" | "medium" | "large" | "wide"
  image: Image
}

// DynamicBlock interfaces

export interface HeroBlock {
  __component: 'blocks.hero'
  id: number
  heading: string
  span: {
    type: string
    children: { text: string; type: string }[]
  }[]
  text: string
  links: Link[]
  images: Image[]
}

export interface BlockSectionHeader {
  __component: "blocks.section-header"
  id: number
  heading: string
  subheading: string
  badge: string
  anchorLink: Link | null
}

export interface BlockContentWithVideo {
  __component: "blocks.content-with-video"
  id: number
  heading: string
  text: RichText[]
  reversed: boolean
  videoUrl: string
  thumbnail: Image
}

export interface BlockContentWithImage {
  __component: "blocks.content-with-image"
  id: number
  heading: string
  text: RichText[]
  features: RichText[]
  reversed: boolean
  image: Image
}

export interface BlockGridCard {
  __component: "blocks.grid-card"
  id: number
  cards: GridCardItem[]
}

export interface BlockGridCardImage {
  __component: "blocks.grid-card-image"
  id: number
  cards: GridCardItem[]
  image: Image
}

export interface BlockBentoGridCard {
  __component: "blocks.bento-grid-card"
  id: number
  cards: BentoCardItem[]
}

export interface BlockCarousel {
  __component: "blocks.carousel"
  id: number
  images: Image[]
}

export interface FaqItem {
  id: number
  heading: string
  text: string
}

export interface BlockFaq {
  __component: "blocks.faq"
  id: number
  faqs: FaqItem[]
}

export interface BlockFeaturedArticles {
  __component: "blocks.featured-articles"
  id: number
  articles: Article[]
}

export interface BlockTestimonials {
  __component: "blocks.testimonials"
  id: number
  heading: string
  subheading: string
  testimonials: TestimonialItem[]
}

export interface TestimonialItem {
  id: number
  name: string
  role: string
  company: string
  quote: string
  avatar: Image | null
  rating: number
}

export interface BlockCtaBanner {
  __component: "blocks.cta-banner"
  id: number
  heading: string
  text: string
  primaryLink: Link | null
  secondaryLink: Link | null
  backgroundStyle: "default" | "primary" | "gradient"
}

export interface BlockRichText {
  __component: "blocks.rich-text"
  id: number
  content: RichText[]
}

export interface Article {
  id: number
  documentId: string
  title: string
  description: string
  slug: string
  time: number
  content: string
  createdAt: string
  updatedAt: string
  publishedAt: string
  locale: string
  featuredImage: Image
  author: Author
  date: string
  contentTags: ContentTag[]
}

export interface Author {
  id: number
  documentId: string
  fullName: string
  bio: string
  createdAt: string
  updatedAt: string
  publishedAt: string
  locale: string
  image: Image
}

export interface ContentTag {
  id: number
  documentId: string
  title: string
  description: string
  createdAt: string
  updatedAt: string
  publishedAt: string
  locale: string
}

export type DynamicBlock =
  | HeroBlock
  | BlockSectionHeader
  | BlockContentWithVideo
  | BlockContentWithImage
  | BlockGridCard
  | BlockGridCardImage
  | BlockBentoGridCard
  | BlockCarousel
  | BlockFaq
  | BlockFeaturedArticles
  | BlockTestimonials
  | BlockCtaBanner
  | BlockRichText

export interface Page {
  id: number
  documentId: string
  title: string
  description: string | null
  slug: string
  createdAt: string
  updatedAt: string
  publishedAt: string
  locale: string
  blocks: DynamicBlock[]
}

export interface Job {
  id: number
  documentId: string
  position: string
  slug: string
  departament: string | null
  place: string | null
  time: string | null
  description: string | null
  requirements: RichText[]
  statusJob: 'Disponible' | 'No disponible' | null
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACTOR' | 'TEMPORARY' | 'INTERN' | null
  validThrough: string | null
  salaryMin: number | null
  salaryMax: number | null
  currency: string | null
  link: Link[]
  createdAt: string
  updatedAt: string
  publishedAt: string
  locale: string
}
