import { createBrowserRouter, Navigate } from 'react-router-dom'
import ProtectedLayout from '../auth/ProtectedLayout'
import PublicLayout from '../auth/PublicLayout'
import Dashboard from '../components/Dashboard'
import SignIn from '../pages/SignIn'
import Root from '../pages/Root'
import SignUp from '../pages/SignUp'

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
            element: <Navigate to="signin" replace />,
          },
          {
            path: 'signin',
            element: <SignIn />,
          },
          {
            path: 'signup',
            element: <SignUp />,
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
