import { Button, Stack, Typography } from '@mui/material'
import { useNavigate, useRouteError } from 'react-router-dom'
import MainLayout from '../components/MainLayout'

type Error = {
  statusText: string
  message: string
}

export default function Error() {
  const error = useRouteError() as Error
  const navigate = useNavigate()
  console.error(error)

  return (
    <MainLayout>
      <Stack justifyContent="center" alignItems="center" spacing={5}>
        <Typography variant="h1" fontSize={30}>
          Oops!
        </Typography>
        <Typography>Sorry, an unexpected error has occurred.</Typography>
        <Typography component="i">{error.statusText || error.message}</Typography>
        <Button onClick={() => navigate('/', { replace: true })}>Go back to Sign In Page</Button>
      </Stack>
    </MainLayout>
  )
}
