import type { ReactNode } from 'react'
import { Footer } from '../Footer/Footer'
import { Header } from '../Header/Header'
import './Layout.css'

type LayoutProps = {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="layout">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <Header />
      <main id="main-content" className="layout__main" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </div>
  )
}
