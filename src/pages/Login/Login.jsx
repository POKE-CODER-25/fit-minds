import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import FormField from '../../components/FormField.jsx'
import {
  getAuthErrorMessage,
  loginWithEmail,
  sendResetEmail,
} from '../../services/authService.js'
import { getFitnessProfile } from '../../services/firestoreService.js'

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
      const credential = await loginWithEmail(form.email, form.password)
      const existingProfile = await getFitnessProfile(credential.user.uid)
      const destination =
        location.state?.from?.pathname ||
        (existingProfile ? '/home' : '/profile')

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
    <section className="mx-auto flex w-full max-w-5xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="w-full max-w-xl rounded-3xl bg-white p-6 text-black shadow-xl shadow-black/20 sm:p-8">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#75ff38]">
          Prototype Version
        </p>
        <h1 className="mt-3 text-3xl font-black text-[#12351f]">Login</h1>

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
            <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
              {error}
            </p>
          )}
          {message && (
            <p className="rounded-2xl bg-[#f7fff2] px-4 py-3 text-sm font-bold text-[#12351f]">
              {message}
            </p>
          )}

          <button
            className="w-full rounded-2xl bg-[#75ff38] px-6 py-3 font-black text-black shadow-lg shadow-[#75ff38]/20 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={loading || resetLoading}
            type="submit"
          >
            {loading ? 'Please wait...' : 'Login'}
          </button>
        </form>

        <div className="mt-5 flex flex-col gap-3 text-center text-sm font-bold text-[#12351f] sm:flex-row sm:items-center sm:justify-between">
          <button
            className="text-left underline decoration-[#75ff38] decoration-2 underline-offset-4 disabled:opacity-60 sm:text-center"
            disabled={loading || resetLoading}
            onClick={handleResetPassword}
            type="button"
          >
            {resetLoading ? 'Sending reset email...' : 'Forgot Password?'}
          </button>
          <Link
            className="underline decoration-[#75ff38] decoration-2 underline-offset-4"
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
