import { createBrowserRouter, Navigate } from 'react-router-dom'
import ProtectedLayout from '../auth/ProtectedLayout'
import PublicLayout from '../auth/PublicLayout'
import Dashboard from '../components/Dashboard'
import Login from '../pages/Login'
import Root from '../pages/Root'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        element: <PublicLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/login" replace />,
          },
          {
            path: 'login',
            element: <Login />,
          },
        ],
      },
      {
        element: <ProtectedLayout />,
        children: [
          {
            path: 'dashboard',
            element: <Dashboard />,
          },
        ],
      },
    ],
  },
])

export default router
