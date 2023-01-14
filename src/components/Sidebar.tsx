import { Avatar, Badge, Box, Stack, styled, Typography } from '@mui/material'

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
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

export default function Sidebar() {
  return (
    <Stack height="100%" width="20%" justifyContent="space-between" alignItems="center">
      <Box marginX={4} marginY={8}>
        Sentiment Analysis Client
      </Box>
      <Stack margin={4} spacing={2} alignItems="center">
        <StyledBadge overlap="circular" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} variant="dot">
          <Avatar sx={{ width: 80, height: 80 }} />
        </StyledBadge>
        <Box textAlign="center">
          <Typography fontSize={18} fontWeight="bold" variant="subtitle1">
            Joe Doe
          </Typography>
          <Typography fontSize={14} fontWeight="normal" variant="subtitle2">
            Admin
          </Typography>
        </Box>
      </Stack>
      <Box margin={4}>
        <Stack spacing={4}>
          <Box>Dashboard</Box>
          <Box>Settings</Box>
        </Stack>
      </Box>
      <Box marginX={4} marginY={8}>
        Logout
      </Box>
    </Stack>
  )
}
