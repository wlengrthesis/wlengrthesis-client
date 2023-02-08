import { Avatar, Box, Button, Container, TextField, Typography } from '@mui/material'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { useAuth } from '../auth/AuthProvider'
import { useStore } from '../store'

interface IFormInput {
  email: string
  password: string
  firstName: string
  lastName: string
}

const SignUp = () => {
  const { signUp } = useAuth()
  const setUser = useStore(state => state.setUser)
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
  })

  const onSubmit: SubmitHandler<IFormInput> = ({ email, password, firstName, lastName }) => {
    signUp({ email, password, firstName, lastName }).then(id => {
      setUser({ id, email, firstName, lastName })
    })
  }

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{ borderRadius: 8, backgroundColor: 'white', height: '80%', marginTop: 4 }}
    >
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1 }} />
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
          <Controller
            name="firstName"
            control={control}
            render={({ field }) => <TextField margin="normal" fullWidth id="firstName" label="First Name" {...field} />}
          />
          <Controller
            name="lastName"
            control={control}
            render={({ field }) => <TextField margin="normal" fullWidth id="lastName" label="Last Name" {...field} />}
          />
          <Controller
            name="email"
            control={control}
            rules={{ required: 'Email is required', maxLength: { value: 20, message: 'Maximum characters: 20' } }}
            render={({ field }) => (
              <>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  autoComplete="email"
                  {...field}
                />
                <Typography height={16} color="red" variant="body2">
                  {errors.email ? errors.email.message : ''}
                </Typography>
              </>
            )}
          />
          <Controller
            name="password"
            control={control}
            rules={{ required: 'Password is required', maxLength: { value: 20, message: 'Maximum characters: 20' } }}
            render={({ field }) => (
              <>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  {...field}
                />
                <Typography height={16} color="red" variant="body2">
                  {errors.password ? errors.password.message : ''}
                </Typography>
              </>
            )}
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Sign Up
          </Button>
        </Box>
      </Box>
    </Container>
  )
}

export default SignUp
