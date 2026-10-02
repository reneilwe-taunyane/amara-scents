import { Layout } from './components/Layout/Layout'
import { CartPage } from './pages/CartPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { OrderConfirmationPage } from './pages/OrderConfirmationPage'
import { ProductPage } from './pages/ProductPage'
import { ShopPage } from './pages/ShopPage'
import { AuthPage } from './pages/AuthPage'
import { useRouter } from './router/RouterContext'
import type { Route } from './router/routes'

function renderRoute(route: Route) {
  switch (route.name) {
    case 'home': return <HomePage />
    case 'shop': return <ShopPage />
    case 'product': return <ProductPage slug={route.slug} />
    case 'cart': return <CartPage />
    case 'checkout': return <CheckoutPage />
    case 'signIn':
    case 'signUp': return <AuthPage />
    case 'orderConfirmation': return <OrderConfirmationPage />
    default: return <NotFoundPage path={route.path} />
  }
}

function App() {
  const { route } = useRouter()
  return <Layout>{renderRoute(route)}</Layout>
}

export default App
