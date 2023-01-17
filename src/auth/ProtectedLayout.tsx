import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './AuthProvider'

const ProtectedLayout = () => {
  const { tokens } = useAuth()

  if (!tokens.accessToken && !tokens.refreshToken) {
    return <Navigate to="/signin" replace />
  }

  return <Outlet />
}

export default ProtectedLayout
