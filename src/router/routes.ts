export type Route =
  | { name: 'home' }
  | { name: 'shop' }
  | { name: 'product'; slug: string }
  | { name: 'cart' }
  | { name: 'checkout' }
  | { name: 'signIn' }
  | { name: 'signUp' }
  | { name: 'orderConfirmation' }
  | { name: 'notFound'; path: string }

export const ROUTE_PATHS = {
  home: '/',
  shop: '/shop',
  cart: '/cart',
  checkout: '/checkout',
  signIn: '/sign-in',
  signUp: '/sign-up',
  orderConfirmation: '/order-confirmation',
} as const

function normalizePathname(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith('/')) return pathname.slice(0, -1)
  return pathname
}

function decodeSegment(segment: string): string | null {
  try { return decodeURIComponent(segment) } catch { return null }
}

export function matchRoute(pathname: string): Route {
  const path = normalizePathname(pathname)
  if (path === ROUTE_PATHS.home) return { name: 'home' }
  if (path === ROUTE_PATHS.shop) return { name: 'shop' }
  if (path === ROUTE_PATHS.cart) return { name: 'cart' }
  if (path === ROUTE_PATHS.checkout) return { name: 'checkout' }
  if (path === ROUTE_PATHS.signIn) return { name: 'signIn' }
  if (path === ROUTE_PATHS.signUp) return { name: 'signUp' }
  if (path === ROUTE_PATHS.orderConfirmation) return { name: 'orderConfirmation' }
  const productSegments = path.split('/')
  if (productSegments.length === 3 && productSegments[1] === 'product') {
    const slug = decodeSegment(productSegments[2])
    if (slug) return { name: 'product', slug }
  }
  return { name: 'notFound', path }
}

export function productPath(slug: string): string {
  return `/product/${encodeURIComponent(slug)}`
}
