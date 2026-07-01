import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import LoadingSpinner from './LoadingSpinner.jsx'

function ProtectedRoute({ requireProfile = false }) {
  const { currentUser, loading, profile, profileLoading } = useAuth()
  const location = useLocation()

  if (loading || profileLoading) {
    return <LoadingSpinner />
  }

  if (!currentUser) {
    return <Navigate replace state={{ from: location }} to="/login" />
  }

  if (requireProfile && !profile) {
    return <Navigate replace to="/profile" />
  }

  return <Outlet />
}

export default ProtectedRoute
