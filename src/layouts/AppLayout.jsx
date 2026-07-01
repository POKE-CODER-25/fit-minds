import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import { getAuthErrorMessage, logoutUser } from '../services/authService.js'

const authenticatedLinks = [
  { label: 'Home', to: '/home' },
  { label: 'Workout', to: '/workout' },
  { label: 'Diet', to: '/diet' },
  { label: 'Pedometer', to: '/pedometer' },
  { label: 'Health AI', to: '/health-ai' },
  { label: 'Profile', to: '/profile' },
]

const guestLinks = [
  { label: 'Login', to: '/login' },
  { label: 'Signup', to: '/signup' },
]

function AppLayout() {
  const { currentUser } = useAuth()
  const links = currentUser ? authenticatedLinks : guestLinks

  async function handleLogout() {
    try {
      await logoutUser()
    } catch (error) {
      window.alert(getAuthErrorMessage(error))
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#050805] text-white">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#050805]">
        <nav className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <NavLink to="/" className="text-lg font-black text-[#75ff38]">
            Fit Minds
          </NavLink>
          <div className="flex max-w-[72vw] gap-2 overflow-x-auto pb-1 text-sm font-semibold text-white/75">
            {links.map((link) => (
              <NavLink
                className={({ isActive }) =>
                  `shrink-0 rounded-full px-3 py-2 transition ${
                    isActive
                      ? 'bg-[#75ff38] text-black'
                      : 'bg-white/10 hover:bg-white/15'
                  }`
                }
                key={link.to}
                to={link.to}
              >
                {link.label}
              </NavLink>
            ))}
            {currentUser && (
              <button
                className="shrink-0 rounded-full bg-[#ffdd33] px-3 py-2 font-black text-black transition hover:bg-[#ffe866]"
                onClick={handleLogout}
                type="button"
              >
                Logout
              </button>
            )}
          </div>
        </nav>
      </header>

      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

      <footer className="border-t border-white/10 bg-black px-4 py-5 text-center text-sm text-white/60">
        Fit Minds Prototype
      </footer>
    </div>
  )
}

export default AppLayout
