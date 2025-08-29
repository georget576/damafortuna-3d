import { ReactNode } from 'react'
import LearnLayoutWrapper from './components/LearnLayoutWrapper'

interface LearnLayoutProps {
  children: ReactNode
  params: {
    page?: string
  }
}

export default function LearnLayout({ children, params }: LearnLayoutProps) {
  return (
    <LearnLayoutWrapper currentPage={params.page || 'overview'}>
      {children}
    </LearnLayoutWrapper>
  )
}