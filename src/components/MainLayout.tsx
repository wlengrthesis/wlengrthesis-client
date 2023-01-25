import { Container, Stack, useMediaQuery, useTheme } from '@mui/material'
import { ReactNode } from 'react'

interface IMainLayoutProps {
  children: ReactNode
}

export default function MainLayout({ children }: IMainLayoutProps) {
  const theme = useTheme()
  const isWiderThanXl = useMediaQuery(theme.breakpoints.up('xl'))
  return (
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
      <Stack direction="row" justifyContent="center" height="100%" minHeight={780} minWidth={960}>
        {children}
      </Stack>
    </Container>
  )
}
