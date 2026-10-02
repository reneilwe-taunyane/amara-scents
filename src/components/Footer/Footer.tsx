import { Link } from '../../router/Link'
import { ROUTE_PATHS } from '../../router/routes'
import './Footer.css'

const FOOTER_LINKS = [
  { label: 'Home', to: ROUTE_PATHS.home },
  { label: 'Shop', to: ROUTE_PATHS.shop },
  { label: 'Bag', to: ROUTE_PATHS.cart },
  { label: 'Checkout', to: ROUTE_PATHS.checkout },
]

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand-block">
          <p className="footer__wordmark">
            Amara<span className="footer__wordmark-accent"> Scents</span>
          </p>
          <p className="footer__tagline">
            Premium South African fragrance, bottled to be worn and felt.
          </p>
        </div>

        <nav className="footer__nav" aria-label="Footer">
          <h2 className="footer__heading">Explore</h2>
          <ul className="footer__list">
            {FOOTER_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="footer__link">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <p className="footer__legal">
        &copy; {currentYear} Amara Scents. All rights reserved.
      </p>
    </footer>
  )
}
