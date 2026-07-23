import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import FormField from '../../components/FormField.jsx'
import Button from '../../components/ui/Button.jsx'
import {
  getAuthErrorMessage,
  signupWithEmail,
} from '../../services/authService.js'

function Signup() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  function handleChange(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      await signupWithEmail(form.email, form.password)
      navigate('/home', { replace: true })
    } catch (caughtError) {
      setError(getAuthErrorMessage(caughtError))
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="app-container-narrow page-shell flex items-center justify-center">
      <div className="ui-card w-full max-w-xl p-6 sm:p-8">
        <p className="type-eyebrow text-[var(--color-primary)]">
          Prototype Version
        </p>
        <h1 className="type-page-title mt-3">Signup</h1>

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
            min="6"
            name="password"
            onChange={handleChange}
            placeholder="At least 6 characters"
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

          <Button
            disabled={loading}
            fullWidth
            loading={loading}
            size="large"
            type="submit"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm font-bold text-[var(--color-text-secondary)]">
          Already have an account?{' '}
          <Link
            className="rounded-[var(--radius-sm)] text-[var(--color-primary)] underline decoration-2 underline-offset-4"
            to="/login"
          >
            Login
          </Link>
        </p>
      </div>
    </section>
  )
}

export default Signup
