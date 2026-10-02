import type { ReactNode } from 'react'
import './EmptyState.css'

type EmptyStateProps = {
  title: string
  description: string
  children?: ReactNode
}

export function EmptyState({ title, description, children }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <h2 className="empty-state__title">{title}</h2>
      <p className="empty-state__description">{description}</p>
      {children && <div className="empty-state__actions">{children}</div>}
    </div>
  )
}
