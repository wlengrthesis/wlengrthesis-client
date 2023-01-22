import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './AuthProvider'

const PublicLayout = () => {
  const {
    refresh,
    tokens: { refreshToken },
  } = useAuth()

  const passThrough = () => {
    if (refreshToken && refreshToken[0] && refreshToken[1]) {
      const daysFromRefresh = (Date.now() - refreshToken[1]) / 1000 / 60 / 60 / 24
      if (daysFromRefresh >= 2) return false
      if (daysFromRefresh <= 1) return true
      let isOk = false
      refresh()
        .then(value => {
          isOk = !!value
        })
        .catch(() => {
          isOk = false
        })
      return isOk
    }
    return false
  }

  if (passThrough()) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}

export default PublicLayout
