import { BlockGridCard } from "@/types/strapi"
import { LucideIcon, Zap, Users, Award } from "lucide-react"
import { NumberTicker } from "@/components/magicui/number-ticker"

const iconMap: Record<string, LucideIcon> = {
    zap: Zap,
    users: Users,
    award: Award,
}

export default function GridCard( props : BlockGridCard) {
    const { id, cards } = props
    return (
        <section key={id} className="py-12">
            <div className="container mx-auto p-6 max-w-6xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {cards.map((card) => {
                    const Icon = iconMap[card.icon] || Zap
                    return (
                        <div key={card.id} className="p-6 text-center space-y-2">
                            <div className="text-primary mx-auto">
                                <Icon className="size-16 mx-auto mb-4" />
                            </div>
                            <NumberTicker
                                value={card.number}
                                className="text-4xl md:text-5xl font-bold text-primary"
                            /> <span className="text-4xl md:text-5xl font-bold text-primary" >+</span>
                            <p className="text-muted-foreground">{card.text}</p>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}
