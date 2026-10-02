import { Link } from '../router/Link'
import { ROUTE_PATHS } from '../router/routes'
import './page.css'

type NotFoundPageProps = {
  path: string
}

export function NotFoundPage({ path }: NotFoundPageProps) {
  return (
    <div className="page">
      <p className="page__eyebrow">404</p>
      <h1 className="page__title">We could not find that page</h1>
      <p className="page__lede">
        Nothing lives at <code>{path}</code>.
      </p>

      <section className="page__section">
        <Link to={ROUTE_PATHS.shop}>Back to the collection</Link>
      </section>
    </div>
  )
}
