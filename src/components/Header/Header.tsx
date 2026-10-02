import { useEffect, useState } from 'react'
import { useAuth } from '../../auth/AuthContext'
import { useCart } from '../../cart/CartContext'
import { Link } from '../../router/Link'
import { useRouter } from '../../router/RouterContext'
import { ROUTE_PATHS } from '../../router/routes'
import './Header.css'

type NavItem = {
  label: string
  to: string
  matchNames: string[]
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', to: ROUTE_PATHS.home, matchNames: ['home'] },
  { label: 'Shop', to: ROUTE_PATHS.shop, matchNames: ['shop', 'product'] },
  { label: 'Bag', to: ROUTE_PATHS.cart, matchNames: ['cart'] },
]

export function Header() {
  const { route } = useRouter()
  const { itemCount } = useCart()
  const { user, isLoading, signOut } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [authError, setAuthError] = useState('')

  useEffect(() => {
    if (!isMenuOpen) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsMenuOpen(false)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isMenuOpen])

  const returnTo = `${window.location.pathname}${window.location.search}`
  const signInPath = `${ROUTE_PATHS.signIn}?returnTo=${encodeURIComponent(returnTo)}`

  return (
    <header className="header">
      <div className="header__inner">
        <Link to={ROUTE_PATHS.home} className="header__brand">
          Amara<span className="header__brand-accent"> Scents</span>
        </Link>

        <button
          type="button"
          className="header__toggle"
          aria-expanded={isMenuOpen}
          aria-controls="primary-navigation"
          onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
        >
          <span className="visually-hidden">
            {isMenuOpen ? 'Close menu' : 'Open menu'}
          </span>
          <span className="header__toggle-bars" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>

        <nav
          id="primary-navigation"
          className={`header__nav${isMenuOpen ? ' header__nav--open' : ''}`}
          aria-label="Primary"
        >
          <ul className="header__nav-list">
            {NAV_ITEMS.map((item) => {
              const isCurrent = item.matchNames.includes(route.name)
              return (
                <li key={item.to} className="header__nav-item">
                  <Link
                    to={item.to}
                    className="header__nav-link"
                    aria-current={isCurrent ? 'page' : undefined}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                    {item.to === ROUTE_PATHS.cart && itemCount > 0 && (
                      <span className="header__bag-count">
                        {itemCount}
                        <span className="visually-hidden">
                          {' '}{itemCount === 1 ? 'item' : 'items'} in bag
                        </span>
                      </span>
                    )}
                  </Link>
                </li>
              )
            })}
            {!isLoading && (
              <li className="header__nav-item">
                {user ? (
                  <button
                    type="button"
                    className="header__account-link header__account-link--signed-in"
                    onClick={() => {
                      setAuthError('')
                      void signOut().catch(() => setAuthError('Sign out failed. Please try again.'))
                      setIsMenuOpen(false)
                    }}
                  >
                    Sign out
                  </button>
                ) : (
                  <Link
                    to={signInPath}
                    className="header__account-link"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign in
                  </Link>
                )}
              </li>
            )}
          </ul>
        </nav>
      </div>
      {authError && <p className="header__auth-error" role="alert">{authError}</p>}
    </header>
  )
}
