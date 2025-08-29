import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface CommunityHeaderProps {
  title: string
  description: string
}

export default function CommunityHeader({ title, description }: CommunityHeaderProps) {
  return (
    <div className="text-center mb-6 md:mb-8">
      <h1 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4 font-caveat-brush tarot-gold">{title}</h1>
      <p className="text-base md:text-lg text-gray-300 mb-4 md:mb-6 font-shadows-into-light">
        {description}
      </p>
    </div>
  )
}