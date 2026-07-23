import { NavLink, Outlet } from 'react-router-dom'
import Button from '../components/ui/Button.jsx'
import { useAuth } from '../hooks/useAuth.js'
import { getAuthErrorMessage, logoutUser } from '../services/authService.js'

const icons = {
  brand: 'M12 3c-1 4-4 5-7 5 1 5 3 9 7 13 4-4 6-8 7-13-3 0-6-1-7-5Zm0 5v9',
  home: 'M3 11.5 12 4l9 7.5V21h-6v-6H9v6H3v-9.5Z',
  workout: 'M5 12h14M8 8v8m8-8v8M3 10v4m18-4v4',
  diet: 'M4 5h16v14H4zM8 9h8m-8 4h5',
  report: 'M7 3h10v4H7zM5 7h14v14H5zM8 12h8m-8 4h5',
  steps:
    'M13 5.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM9.5 21l2-6 2 2v4m-6-9 3-4 3 2 3 1',
  ai: 'M12 3v3m0 12v3M3 12h3m12 0h3M8 8l-2-2m10 2 2-2m-2 10 2 2m-10-2-2 2M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z',
}

const authenticatedLinks = [
  { label: 'Home', shortLabel: 'Home', to: '/home', end: true, icon: icons.home },
  { label: 'Workout', shortLabel: 'Workout', to: '/workout', icon: icons.workout },
  { label: 'Diet', shortLabel: 'Diet', to: '/diet', end: true, icon: icons.diet },
  {
    label: 'Diet Report',
    shortLabel: 'Report',
    to: '/diet-report',
    end: true,
    icon: icons.report,
  },
  {
    label: 'Pedometer',
    shortLabel: 'Steps',
    to: '/pedometer',
    end: true,
    icon: icons.steps,
  },
  {
    label: 'Health AI',
    shortLabel: 'Health AI',
    to: '/health-ai',
    end: true,
    icon: icons.ai,
  },
]

const guestLinks = [
  { label: 'Login', to: '/login' },
  { label: 'Signup', to: '/signup' },
]

function Icon({ path, className = 'h-5 w-5' }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.9"
      viewBox="0 0 24 24"
    >
      <path d={path} />
    </svg>
  )
}

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
    <div className="surface-base flex min-h-screen flex-col">
      <header className="app-header">
        <nav
          aria-label="Primary navigation"
          className="app-container flex min-h-16 items-center justify-between gap-6"
        >
          <NavLink className="app-brand" to="/">
            <span className="app-brand__mark">
              <Icon className="h-5 w-5" path={icons.brand} />
            </span>
            <span>Fit Minds</span>
          </NavLink>

          <div className="hidden items-center gap-1 xl:flex">
            {links.map((link) => (
              <NavLink
                className="desktop-nav-link"
                end={link.end}
                key={link.to}
                to={link.to}
              >
                {link.label}
              </NavLink>
            ))}
            {currentUser && (
              <Button
                className="ml-3"
                onClick={handleLogout}
                size="small"
                variant="accent"
              >
                Logout
              </Button>
            )}
          </div>

          <div className="flex items-center xl:hidden">
            {currentUser ? (
              <Button onClick={handleLogout} size="small" variant="accent">
                Logout
              </Button>
            ) : (
              <div className="flex items-center gap-1">
                {guestLinks.map((link) => (
                  <NavLink
                    className="desktop-nav-link"
                    end
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

      <main className="mobile-nav-safe flex-1">
        <Outlet />
      </main>

      <footer className="mb-[var(--mobile-nav-clearance)] border-t border-[var(--color-border)] px-4 py-6 text-center text-sm text-[var(--color-text-muted)] xl:mb-0">
        Fit Minds Prototype
      </footer>

      {currentUser && (
        <nav aria-label="Mobile navigation" className="mobile-app-nav xl:hidden">
          <div className="mx-auto grid max-w-3xl grid-cols-6 gap-1">
            {authenticatedLinks.map((link) => (
              <NavLink
                aria-label={link.label}
                className="mobile-nav-link"
                end={link.end}
                key={link.to}
                to={link.to}
              >
                <Icon className="h-5 w-5" path={link.icon} />
                <span>{link.shortLabel}</span>
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </div>
  )
}

export default AppLayout
