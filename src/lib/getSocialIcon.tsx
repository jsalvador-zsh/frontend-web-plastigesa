import {
  Facebook,
  Instagram,
  Linkedin,
  Music2,
} from 'lucide-react'
import { JSX } from 'react'

export const getSocialIcon = (icon: string): JSX.Element | null => {
  const map: Record<string, JSX.Element> = {
    facebook: <Facebook className="size-5 text-muted-foreground hover:text-primary transition-colors" />,
    instagram: <Instagram className="size-5 text-muted-foreground hover:text-primary transition-colors" />,
    linkedin: <Linkedin className="size-5 text-muted-foreground hover:text-primary transition-colors" />,
    tiktok: <Music2 className="size-5 text-muted-foreground hover:text-primary transition-colors" />,
  }

  return map[icon.toLowerCase()] || null
}
