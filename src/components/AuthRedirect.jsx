import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import LoadingSpinner from './LoadingSpinner.jsx'

function AuthRedirect() {
  const { currentUser, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  if (!currentUser) {
    return <Outlet />
  }

  return <Navigate replace to="/home" />
}

export default AuthRedirect
