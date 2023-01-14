import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

import { Container, CssBaseline, Stack, useMediaQuery, useTheme } from '@mui/material'
import Dashboard from './components/Dashboard'
import Sidebar from './components/Sidebar'

function App() {
  const theme = useTheme()
  const isWiderThanXl = useMediaQuery(theme.breakpoints.up('xl'))
  return (
    <>
      <CssBaseline />

      <Container
        maxWidth="xl"
        disableGutters
        sx={{
          height: 'calc(100vh - 32px)',
          marginY: 2,
          padding: 0,
          borderRadius: 5,
          boxShadow: isWiderThanXl ? '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' : 'none',
        }}
      >
        <Stack direction="row" height="100%">
          <Sidebar />
          <Dashboard />
        </Stack>
      </Container>
    </>
  )
}

export default App
