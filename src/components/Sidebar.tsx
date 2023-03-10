import { Avatar, Badge, Box, Stack, styled, Typography, BadgeProps, Button } from '@mui/material'
import { FC, ReactNode, useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthProvider'
import { useStore } from '../store'

const useNavigatorOnline = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleStatusChange = () => {
      setIsOnline(navigator.onLine)
    }

    window.addEventListener('online', handleStatusChange)
    window.addEventListener('offline', handleStatusChange)

    return () => {
      window.removeEventListener('online', handleStatusChange)
      window.removeEventListener('offline', handleStatusChange)
    }
  }, [])

  return isOnline
}

interface IStyledBadgeProps extends BadgeProps {
  isOnline: boolean
  children: ReactNode
}

const StyledBadge: FC<IStyledBadgeProps> = ({ isOnline, children, ...props }) => {
  const color = isOnline ? '#44b700' : '#e7e7e7'
  const Styled = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      color,
      backgroundColor: color,
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      width: 20,
      height: 20,
      borderRadius: '100%',
      '&::after': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        animation: 'ripple 10s infinite ease-in-out',
        border: '1px solid currentColor',
        content: '""',
      },
    },
    '@keyframes ripple': {
      '0%': {
        transform: 'scale(.8)',
        opacity: 1,
      },
      '10%': {
        transform: 'scale(1.6)',
        opacity: 0,
      },
      '30%': {
        transform: 'scale(1)',
      },
    },
  }))
  return <Styled {...props}>{children}</Styled>
}

export default function Sidebar() {
  const { logout } = useAuth()
  const { firstName, lastName, email } = useStore(state => state.user)
  const isOnline = useNavigatorOnline()
  return (
    <Stack
      height="96%"
      width="20%"
      justifyContent="space-between"
      alignItems="center"
      borderRadius={8}
      bgcolor="white"
      m={2}
    >
      <Typography variant="h1" fontSize={20} marginX={4} marginY={8}>
        Sentiment Analysis Client
      </Typography>
      <Stack margin={4} spacing={2} alignItems="center">
        <StyledBadge
          isOnline={isOnline}
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          variant="dot"
        >
          <Avatar sx={{ width: 80, height: 80 }} />
        </StyledBadge>
        <Box textAlign="center">
          <Typography fontSize={18} fontWeight="bold" variant="subtitle1">
            {firstName} {lastName}
          </Typography>
          <Typography fontSize={14} fontWeight="normal" variant="subtitle2">
            {email}
          </Typography>
        </Box>
      </Stack>
      <Box margin={4}>
        <Stack spacing={4}>
          <Button>Dashboard</Button>
          <Button>Settings</Button>
        </Stack>
      </Box>
      <Button sx={{ marginX: 4, marginY: 8 }} onClick={logout}>
        Logout
      </Button>
    </Stack>
  )
}
