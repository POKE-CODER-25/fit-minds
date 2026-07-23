import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import { getAuthErrorMessage, logoutUser } from '../services/authService.js'

const authenticatedLinks = [
  { label: 'Home', to: '/home' },
  { label: 'Workout', to: '/workout' },
  { label: 'Diet', to: '/diet' },
  { label: 'Pedometer', to: '/pedometer' },
  { label: 'Health AI', to: '/health-ai' },
]

const mobileLinks = [
  { label: 'Home', to: '/home' },
  { label: 'Steps', to: '/pedometer' },
  { label: 'Workout', to: '/workout' },
  { label: 'Diet', to: '/diet' },
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
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#050805]">
        <nav className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <NavLink to="/" className="text-lg font-black text-[#75ff38]">
            Fit Minds
          </NavLink>
          <div className="hidden gap-2 text-sm font-semibold text-white/75 md:flex">
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

          <div className="flex items-center gap-2 md:hidden">
            {currentUser ? (
              <button
                className="rounded-full bg-[#ffdd33] px-3 py-2 text-sm font-black text-black"
                onClick={handleLogout}
                type="button"
              >
                Logout
              </button>
            ) : (
              <div className="flex gap-2 text-sm font-semibold text-white/75">
                {guestLinks.map((link) => (
                  <NavLink
                    className={({ isActive }) =>
                      `rounded-full px-3 py-2 transition ${
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
              </div>
            )}
          </div>
        </nav>
      </header>

      <main className="flex-1 overflow-y-auto pb-24 md:pb-0">
        <Outlet />
      </main>

      <footer className="mb-16 border-t border-white/10 bg-black px-4 py-5 text-center text-sm text-white/60 md:mb-0 md:py-6">
        Fit Minds Prototype
      </footer>

      {currentUser && (
        <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-black px-2 pb-3 pt-2 shadow-2xl shadow-black md:hidden">
          <div className="mx-auto grid max-w-md grid-cols-4 gap-1">
            {mobileLinks.map((link) => (
              <NavLink
                className={({ isActive }) =>
                  `rounded-xl px-2 py-2 text-center text-xs font-black transition ${
                    isActive
                      ? 'bg-[#75ff38] text-black'
                      : 'text-white/70 hover:bg-white/10'
                  }`
                }
                key={link.to}
                to={link.to}
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </div>
  )
}

export default AppLayout
