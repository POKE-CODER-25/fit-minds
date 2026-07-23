import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import FormField from '../../components/FormField.jsx'
import Button from '../../components/ui/Button.jsx'
import {
  getAuthErrorMessage,
  loginWithEmail,
  sendResetEmail,
} from '../../services/authService.js'

function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  function getPasswordResetErrorMessage(caughtError) {
    const resetMessages = {
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/too-many-requests': 'Too many attempts. Please try again later.',
      'auth/user-not-found': 'No account found with this email.',
    }

    return (
      resetMessages[caughtError?.code] ||
      'We could not send a password reset email. Please try again.'
    )
  }

  function handleChange(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      await loginWithEmail(form.email, form.password)
      const destination = location.state?.from?.pathname || '/home'

      navigate(destination, { replace: true })
    } catch (caughtError) {
      setError(getAuthErrorMessage(caughtError))
    } finally {
      setLoading(false)
    }
  }

  async function handleResetPassword() {
    setError('')
    setMessage('')
    const email = form.email.trim()

    if (!email) {
      setError('Enter your email address before requesting a reset link.')
      return
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.')
      return
    }

    setResetLoading(true)
    try {
      await sendResetEmail(email)
      setMessage(
        'Password reset email sent. Please check your inbox or spam folder.',
      )
    } catch (caughtError) {
      console.error('Password reset email failed:', caughtError)
      setError(getPasswordResetErrorMessage(caughtError))
    } finally {
      setResetLoading(false)
    }
  }

  return (
    <section className="app-container-narrow page-shell flex items-center justify-center">
      <div className="ui-card w-full max-w-xl p-6 sm:p-8">
        <p className="type-eyebrow text-[var(--color-primary)]">
          Prototype Version
        </p>
        <h1 className="type-page-title mt-3">Login</h1>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <FormField
            label="Email"
            name="email"
            onChange={handleChange}
            placeholder="you@example.com"
            type="email"
            value={form.email}
          />
          <FormField
            label="Password"
            name="password"
            onChange={handleChange}
            placeholder="Enter password"
            type="password"
            value={form.password}
          />

          {error && (
            <p
              aria-live="polite"
              className="rounded-[var(--radius-md)] border border-red-400/25 bg-red-400/10 px-4 py-3 text-sm font-bold text-red-300"
              role="alert"
            >
              {error}
            </p>
          )}
          {message && (
            <p
              aria-live="polite"
              className="rounded-[var(--radius-md)] border border-green-400/25 bg-green-400/10 px-4 py-3 text-sm font-bold text-green-300"
              role="status"
            >
              {message}
            </p>
          )}

          <Button
            disabled={loading || resetLoading}
            fullWidth
            loading={loading}
            size="large"
            type="submit"
          >
            {loading ? 'Please wait...' : 'Login'}
          </Button>
        </form>

        <div className="mt-5 flex flex-col gap-3 text-center text-sm font-bold text-[var(--color-text-secondary)] sm:flex-row sm:items-center sm:justify-between">
          <Button
            className="justify-start px-0 sm:justify-center"
            disabled={loading || resetLoading}
            loading={resetLoading}
            onClick={handleResetPassword}
            variant="ghost"
          >
            {resetLoading ? 'Sending reset email...' : 'Forgot Password?'}
          </Button>
          <Link
            className="min-h-11 content-center rounded-[var(--radius-sm)] text-[var(--color-primary)] underline decoration-2 underline-offset-4"
            to="/signup"
          >
            Create account
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Login
