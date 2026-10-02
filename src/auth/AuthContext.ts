import { createContext, useContext } from 'react'
import type { Session, User } from '@supabase/supabase-js'

export type EmailSignUpDetails = {
  fullName: string
  email: string
  password: string
}

export type AuthContextValue = {
  user: User | null
  session: Session | null
  isLoading: boolean
  isConfigured: boolean
  signInWithGoogle: (returnTo?: string) => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<void>
  signUpWithEmail: (details: EmailSignUpDetails, returnTo?: string) => Promise<boolean>
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth must be used inside an AuthProvider')
  return value
}
