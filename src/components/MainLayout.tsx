import { Container, Stack } from '@mui/material'
import { ReactNode } from 'react'

interface IMainLayoutProps {
  children: ReactNode
}

export default function MainLayout({ children }: IMainLayoutProps) {
  return (
    <Container
      maxWidth="xl"
      disableGutters
      sx={{
        height: 'calc(100vh - 32px)',
        marginY: 2,
        padding: 0,
      }}
    >
      <Stack direction="row" justifyContent="center" height="100%" minHeight={780} minWidth={960}>
        {children}
      </Stack>
    </Container>
  )
}
