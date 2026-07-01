import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import LoadingSpinner from './LoadingSpinner.jsx'

function AuthRedirect() {
  const { currentUser, loading, profile, profileLoading } = useAuth()

  if (loading || profileLoading) {
    return <LoadingSpinner />
  }

  if (!currentUser) {
    return <Outlet />
  }

  return <Navigate replace to={profile ? '/home' : '/profile'} />
}

export default AuthRedirect
