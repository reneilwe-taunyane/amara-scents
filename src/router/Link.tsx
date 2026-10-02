import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from 'react'
import { useRouter } from './RouterContext'

type LinkProps = {
  to: string
  children: ReactNode
  className?: string
  replace?: boolean
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'children'>

export function Link({
  to,
  children,
  className,
  replace = false,
  onClick,
  ...anchorProps
}: LinkProps) {
  const { navigate } = useRouter()

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event)

    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return
    }

    event.preventDefault()
    navigate(to, { replace })
  }

  return (
    <a href={to} className={className} onClick={handleClick} {...anchorProps}>
      {children}
    </a>
  )
}
