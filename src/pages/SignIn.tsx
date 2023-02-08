import { Avatar, Box, Button, Container, TextField, Typography } from '@mui/material'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'
import { useStore } from '../store'

interface IFormInput {
  email: string
  password: string
}

const SignIn = () => {
  const { signIn } = useAuth()
  const setUser = useStore(state => state.setUser)
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<IFormInput>({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit: SubmitHandler<IFormInput> = ({ email, password }) => {
    signIn({ email, password, firstName: null, lastName: null })
      .then(({ id, firstName, lastName }) => {
        setUser({ id, email, firstName, lastName })
      })
      .catch((error: number) => {
        if (error === 403) {
          setError('password', {
            type: 'server',
            message: 'Bad password',
          })
        }
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
          Sign In
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
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
            Sign In
          </Button>
          <Link to="/signup">{"Don't have an account? Sign Up"}</Link>
        </Box>
      </Box>
    </Container>
  )
}

export default SignIn
