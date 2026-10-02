import { useAuth } from '../auth/AuthContext'
import { Button } from '../components/Button/Button'
import { MoodFinder } from '../components/MoodFinder/MoodFinder'
import { ProductImage } from '../components/ProductImage/ProductImage'
import { PRICE_BY_SIZE, PRODUCTS, getProductBySlug } from '../data/products'
import { formatPrice } from '../lib/formatCurrency'
import { ROUTE_PATHS } from '../router/routes'
import './page.css'

const HERO_PRODUCT_SLUG = 'velvet-hour'
const EDITORIAL_PRODUCT_SLUG = 'sahara'

const heroProduct = getProductBySlug(HERO_PRODUCT_SLUG) ?? PRODUCTS[0]
const editorialProduct =
  getProductBySlug(EDITORIAL_PRODUCT_SLUG) ?? PRODUCTS[0]

export function HomePage() {
  const { user } = useAuth()
  const metadata = user?.user_metadata as Record<string, unknown> | undefined
  const savedName = [metadata?.full_name, metadata?.name, metadata?.given_name]
    .find((value): value is string => typeof value === 'string' && value.trim().length > 0)
  const firstName = savedName?.trim().split(/\s+/)[0] ?? user?.email?.split('@')[0]

  return (
    <>
      <section className="hero">
        <div className="hero__inner hero__inner--split">
          <div className="hero__copy">
            <p className="hero__eyebrow">{firstName ? `Welcome, ${firstName}` : 'Amara Scents'}</p>
            <h1 className="hero__title">
              Made for your <span className="script-accent">mood</span>.
            </h1>
            <p className="hero__lede">
              Fragrance for the many ways you feel — sensual, warm, playful,
              mysterious, or effortlessly fresh.
            </p>
            <div className="hero__actions">
              <Button to={ROUTE_PATHS.shop} variant="primary">
                Explore the collection
              </Button>
            </div>
          </div>

          <div className="hero__media">
            <ProductImage
              src={heroProduct.imageUrl}
              alt={heroProduct.imageAlt}
              priority
              sizes="(min-width: 768px) 40vw, 88vw"
            />
          </div>
        </div>
      </section>

      <div className="page">
        <section className="editorial">
          <div className="editorial__media">
            <ProductImage
              src={editorialProduct.imageUrl}
              alt={editorialProduct.imageAlt}
              sizes="(min-width: 768px) 34vw, 88vw"
            />
          </div>
          <div className="editorial__copy">
            <h2 className="editorial__title">
              A scent for every version of{' '}
              <span className="script-accent">you</span>.
            </h2>
            <p className="editorial__text">
              Amara is a contemporary South African fragrance house created
              around mood, self-expression and the little rituals that make you
              feel like yourself. Each scent is an invitation to choose how you
              want to feel — and wear it.
            </p>
          </div>
        </section>

        <MoodFinder />

        <section className="collection-cta">
          <p className="page__eyebrow">All nine</p>
          <h2 className="page__section-title">
            Explore the full{' '}
            <span className="script-accent">collection</span>.
          </h2>
          <p className="page__lede">
            Every fragrance is available in 50 ml for{' '}
            {formatPrice(PRICE_BY_SIZE['50ml'])} and 100 ml for{' '}
            {formatPrice(PRICE_BY_SIZE['100ml'])}.
          </p>
          <div className="collection-cta__action">
            <Button to={ROUTE_PATHS.shop} variant="primary">
              Explore the full collection
            </Button>
          </div>
        </section>
      </div>
    </>
  )
}

