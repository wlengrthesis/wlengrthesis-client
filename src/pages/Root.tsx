import { CssBaseline } from '@mui/material'
import { Outlet } from 'react-router-dom'

import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import AuthProvider from '../auth/AuthProvider'
import MainLayout from '../components/MainLayout'

export default function Root() {
  return (
    <AuthProvider>
      <CssBaseline />
      <MainLayout>
        <Outlet />
      </MainLayout>
    </AuthProvider>
  )
}
