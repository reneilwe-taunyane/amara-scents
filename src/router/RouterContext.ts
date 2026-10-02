import { createContext, useContext } from 'react'
import type { Route } from './routes'

export type RouterValue = {
  route: Route
  navigate: (to: string, options?: { replace?: boolean }) => void
}

export const RouterContext = createContext<RouterValue | null>(null)

export function useRouter(): RouterValue {
  const value = useContext(RouterContext)

  if (!value) {
    throw new Error('useRouter must be used inside a RouterProvider')
  }

  return value
}
