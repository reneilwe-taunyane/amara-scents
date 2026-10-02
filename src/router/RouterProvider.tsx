import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { RouterContext } from './RouterContext'
import { matchRoute } from './routes'

type RouterProviderProps = {
  children: ReactNode
}

export function RouterProvider({ children }: RouterProviderProps) {
  const [pathname, setPathname] = useState(() => window.location.pathname)

  useEffect(() => {
    function handlePopState() {
      setPathname(window.location.pathname)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [pathname])

  const navigate = useCallback((to: string, options?: { replace?: boolean }) => {
    if (options?.replace) {
      window.history.replaceState(null, '', to)
    } else {
      window.history.pushState(null, '', to)
    }

    setPathname(window.location.pathname)
  }, [])

  const value = useMemo(
    () => ({ route: matchRoute(pathname), navigate }),
    [pathname, navigate],
  )

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>
}
