import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

import { Container, CssBaseline } from '@mui/material'
import Sidebar from './components/Sidebar'

function App() {
  return (
    <>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ height: '100vh' }}>
        <Sidebar />
      </Container>
    </>
  )
}

export default App
