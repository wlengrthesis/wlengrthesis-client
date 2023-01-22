import { styled, Paper, Stack, TextField, Box, Button } from '@mui/material'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { makeRequest } from '../helpers/makeRequest'
import { useAuth } from '../auth/AuthProvider'

const StyledPaper = styled(Paper)({
  borderRadius: 20,
})

const StyledTextField = styled(TextField)({
  '& fieldset': {
    borderRadius: 20,
  },
})

interface IFormInput {
  text: string
}

export default function Dashboard() {
  const { tokens, refresh } = useAuth()
  const { control, handleSubmit } = useForm<IFormInput>({
    defaultValues: {
      text: '',
    },
  })

  const onSubmit: SubmitHandler<IFormInput> = ({ text }) => {
    makeRequest('sentiment-analysis/predict', 'POST', { text }, { Authorization: `Bearer ${tokens.accessToken}` })
      .then(value => console.log(value))
      .catch((errorStatus: number) => {
        if (errorStatus === 401) {
          refresh().then(newAccessToken =>
            makeRequest(
              'sentiment-analysis/predict',
              'POST',
              { text },
              { Authorization: `Bearer ${newAccessToken}` }
            ).then(value => console.log(value))
          )
        }
      })
  }

  return (
    <Stack
      height="100%"
      width="80%"
      justifyContent="space-around"
      alignItems="center"
      bgcolor="#f3f1ef"
      borderRadius={5}
    >
      <Stack height="62%" width="90%" direction="row" justifyContent="space-between">
        <StyledPaper sx={{ height: '100%', width: '48%' }} elevation={1}>
          <Box
            component="form"
            noValidate
            autoComplete="off"
            width="90%"
            height="100%"
            marginX="auto"
            paddingY={2}
            onSubmit={handleSubmit(onSubmit)}
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            alignItems="center"
          >
            <Controller
              name="text"
              control={control}
              render={({ field }) => (
                <StyledTextField
                  type="text"
                  label="Text"
                  sx={{ width: '100%', borderRadius: 20 }}
                  multiline
                  minRows={10}
                  maxRows={12}
                  {...field}
                />
              )}
            />
            <Button sx={{ marginY: 2 }} type="submit">
              Send text to analyze sentiment
            </Button>
          </Box>
        </StyledPaper>
        <StyledPaper sx={{ height: '100%', width: '48%' }} elevation={1} />
      </Stack>
      <StyledPaper sx={{ height: '30%', width: '90%' }} elevation={1} />
    </Stack>
  )
}
