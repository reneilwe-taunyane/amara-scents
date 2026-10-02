import { useState } from 'react'
import type { ReactNode } from 'react'
import { useAuth } from '../../auth/AuthContext'
import { Button } from '../Button/Button'
import { Link } from '../../router/Link'
import { ROUTE_PATHS } from '../../router/routes'
import './SignInPanel.css'

type SignInPanelProps = { children?: ReactNode }

export function SignInPanel({ children }: SignInPanelProps) {
  const { user, isLoading, isConfigured, signInWithGoogle, signOut } = useAuth()
  const [errorMessage, setErrorMessage] = useState('')
  if (isLoading) return <div className="sign-in" role="status"><p className="sign-in__status">Checking your session…</p></div>
  if (!isConfigured) return <div className="sign-in sign-in--notice" role="status"><p className="sign-in__status">Sign-in is unavailable because Supabase environment variables are not set. See <code>docs/SETUP.md</code>.</p></div>
  if (!user) return (
    <div className="sign-in">
      <h2 className="sign-in__title">Sign in to continue</h2>
      <p className="sign-in__description">Sign in to save your details and receive your order confirmation. Your bag stays exactly as it is.</p>
      <Button variant="primary" onClick={() => {
        setErrorMessage('')
        void signInWithGoogle('/checkout').catch((error: unknown) => setErrorMessage(error instanceof Error ? error.message : 'Google sign-in could not start. Please try again.'))
      }}>Continue with Google</Button>
      <Link className="sign-in__email-link" to={`${ROUTE_PATHS.signIn}?returnTo=%2Fcheckout`}>Sign in with email and password</Link>
      {errorMessage && <p className="sign-in__status" role="alert">{errorMessage}</p>}
    </div>
  )
  return (
    <div className="sign-in sign-in--signed-in">
      <p className="sign-in__account">Signed in as <span className="sign-in__email">{user.email}</span></p>
      {children}
      <button type="button" className="sign-in__sign-out" onClick={() => {
        void signOut().catch((error: unknown) => setErrorMessage(error instanceof Error ? error.message : 'Sign out failed. Please try again.'))
      }}>Sign out</button>
      {errorMessage && <p className="sign-in__status" role="alert">{errorMessage}</p>}
    </div>
  )
}
