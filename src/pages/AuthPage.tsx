import { useState } from 'react'
import type { FormEvent } from 'react'
import { useAuth } from '../auth/AuthContext'
import { Button } from '../components/Button/Button'
import { Link } from '../router/Link'
import { ROUTE_PATHS } from '../router/routes'
import { useRouter } from '../router/RouterContext'
import './auth-page.css'

function getReturnTo(): string {
  const candidate = new URLSearchParams(window.location.search).get('returnTo')
  return candidate?.startsWith('/') && !candidate.startsWith('//') ? candidate : '/'
}

export function AuthPage() {
  const { route, navigate } = useRouter()
  const { user, isLoading, isConfigured, signInWithGoogle, signInWithEmail, signUpWithEmail, signOut } = useAuth()
  const isSignUp = route.name === 'signUp'
  const returnTo = getReturnTo()
  const query = returnTo !== '/' ? `?returnTo=${encodeURIComponent(returnTo)}` : ''
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')
    setIsSubmitting(true)
    try {
      if (isSignUp) {
        const hasSession = await signUpWithEmail({ fullName, email, password }, returnTo)
        if (hasSession) {
          navigate(returnTo, { replace: true })
        } else {
          setSuccessMessage('Check your email for a confirmation link. After confirming, you’ll return to Amara.')
          setPassword('')
          setIsSubmitting(false)
        }
      } else {
        await signInWithEmail(email, password)
        navigate(returnTo, { replace: true })
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'We could not complete that request. Please try again.')
      setIsSubmitting(false)
    }
  }

  async function handleGoogleAuth() {
    setErrorMessage('')
    setSuccessMessage('')
    setIsSubmitting(true)
    try {
      await signInWithGoogle(returnTo)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Google sign-in could not start. Please try again.')
      setIsSubmitting(false)
    }
  }

  async function handleSignOut() {
    setErrorMessage('')
    try {
      await signOut()
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Sign out failed. Please try again.')
    }
  }

  return (
    <section className="page auth-page" aria-labelledby="auth-title">
      <p className="page__eyebrow">Your Amara account</p>
      <h1 className="page__title" id="auth-title">{isSignUp ? 'Create your account' : 'Welcome back'}</h1>

      {isLoading ? (
        <p className="auth-page__status" role="status">Checking your account…</p>
      ) : user ? (
        <div className="auth-page__content">
          <p>You’re signed in as <strong>{user.email}</strong>.</p>
          <Button variant="outline" onClick={() => void handleSignOut()}>Sign out</Button>
          <Link className="auth-page__text-link" to={returnTo}>Continue to Amara</Link>
        </div>
      ) : !isConfigured ? (
        <p className="auth-page__error" role="alert">Account sign-in is not configured yet. Please check the app setup.</p>
      ) : (
        <div className="auth-page__content">
          <form className="auth-page__form" onSubmit={(event) => void handleSubmit(event)}>
            {isSignUp && (
              <label className="auth-page__field">
                <span>Full name</span>
                <input name="fullName" type="text" autoComplete="name" value={fullName} onChange={(event) => setFullName(event.target.value)} required />
              </label>
            )}
            <label className="auth-page__field">
              <span>Email address</span>
              <input name="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            </label>
            <label className="auth-page__field">
              <span>Password</span>
              <input name="password" type="password" autoComplete={isSignUp ? 'new-password' : 'current-password'} value={password} onChange={(event) => setPassword(event.target.value)} minLength={isSignUp ? 8 : undefined} required />
              {isSignUp && <small>Use at least 8 characters.</small>}
            </label>
            <Button type="submit" variant="primary" fullWidth disabled={isSubmitting}>
              {isSubmitting ? 'Please wait…' : isSignUp ? 'Create account' : 'Sign in'}
            </Button>
          </form>

          {errorMessage && <p className="auth-page__error" role="alert">{errorMessage}</p>}
          {successMessage && <p className="auth-page__success" role="status">{successMessage}</p>}

          <div className="auth-page__divider"><span>or</span></div>
          <Button variant="outline" fullWidth disabled={isSubmitting} onClick={() => void handleGoogleAuth()}>
            {isSubmitting ? 'Connecting to Google…' : 'Continue with Google'}
          </Button>
          <p className="auth-page__switch">
            {isSignUp ? 'Already have an account?' : 'New to Amara?'}{' '}
            <Link className="auth-page__text-link" to={`${isSignUp ? ROUTE_PATHS.signIn : ROUTE_PATHS.signUp}${query}`}>
              {isSignUp ? 'Sign in' : 'Create an account'}
            </Link>
          </p>
        </div>
      )}
    </section>
  )
}


