import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import FormField from '../../components/FormField.jsx'
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
    <section className="mx-auto flex w-full max-w-5xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="w-full max-w-xl rounded-3xl bg-white p-6 text-black shadow-xl shadow-black/20 sm:p-8">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#75ff38]">
          Prototype Version
        </p>
        <h1 className="mt-3 text-3xl font-black text-[#12351f]">Signup</h1>

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
            <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
              {error}
            </p>
          )}

          <button
            className="w-full rounded-2xl bg-[#75ff38] px-6 py-3 font-black text-black shadow-lg shadow-[#75ff38]/20 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={loading}
            type="submit"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm font-bold text-[#12351f]">
          Already have an account?{' '}
          <Link
            className="underline decoration-[#75ff38] decoration-2 underline-offset-4"
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
