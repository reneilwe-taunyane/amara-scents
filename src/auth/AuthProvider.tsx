import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import { AuthContext } from './AuthContext'
import type { AuthContextValue, EmailSignUpDetails } from './AuthContext'

type AuthProviderProps = { children: ReactNode }

function safeReturnPath(path?: string): string {
  if (!path || !path.startsWith('/') || path.startsWith('//')) return '/'
  return path
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured)

  useEffect(() => {
    if (!supabase) return
    let isActive = true
    void supabase.auth.getSession().then(({ data }) => {
      if (isActive) {
        setSession(data.session)
        setIsLoading(false)
      }
    })
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setIsLoading(false)
    })
    return () => {
      isActive = false
      subscription.subscription.unsubscribe()
    }
  }, [])

  const signInWithGoogle = useCallback(async (returnTo = '/') => {
    if (!supabase) return
    const redirectTo = `${window.location.origin}${safeReturnPath(returnTo)}`
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    })
    if (error) throw new Error(error.message)
  }, [])

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    if (!supabase) throw new Error('Sign-in is not configured yet.')
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })
    if (error) throw new Error(error.message)
  }, [])

  const signUpWithEmail = useCallback(async ({ fullName, email, password }: EmailSignUpDetails, returnTo = '/') => {
    if (!supabase) throw new Error('Sign-up is not configured yet.')
    const redirectTo = `${window.location.origin}${safeReturnPath(returnTo)}`
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { full_name: fullName.trim() },
        emailRedirectTo: redirectTo,
      },
    })
    if (error) throw new Error(error.message)
    return Boolean(data.session)
  }, [])

  const signOut = useCallback(async () => {
    if (!supabase) return
    const { error } = await supabase.auth.signOut()
    if (error) throw new Error(error.message)
  }, [])

  const value = useMemo<AuthContextValue>(() => ({
    user: (session?.user as User | undefined) ?? null,
    session,
    isLoading,
    isConfigured: isSupabaseConfigured,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut,
  }), [session, isLoading, signInWithGoogle, signInWithEmail, signUpWithEmail, signOut])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
