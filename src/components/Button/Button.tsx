import type { MouseEventHandler, ReactNode } from 'react'
import { Link } from '../../router/Link'
import './Button.css'

type ButtonVariant = 'primary' | 'accent' | 'outline' | 'quiet'

type ButtonProps = {
  children: ReactNode
  variant?: ButtonVariant
  to?: string
  type?: 'button' | 'submit'
  onClick?: MouseEventHandler<HTMLButtonElement>
  disabled?: boolean
  fullWidth?: boolean
  className?: string
  ariaLabel?: string
}

export function Button({
  children,
  variant = 'primary',
  to,
  type = 'button',
  onClick,
  disabled = false,
  fullWidth = false,
  className = '',
  ariaLabel,
}: ButtonProps) {
  const classNames = [
    'button',
    `button--${variant}`,
    fullWidth ? 'button--full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  if (to) {
    return (
      <Link to={to} className={classNames} aria-label={ariaLabel}>
        {children}
      </Link>
    )
  }

  return (
    <button
      type={type}
      className={classNames}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  )
}
