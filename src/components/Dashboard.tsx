import { Stack, TextField, Box, Button, Typography } from '@mui/material'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { makeRequest } from '../helpers/makeRequest'
import { useAuth } from '../auth/AuthProvider'
import Sidebar from './Sidebar'
import DataTable from './DataTable'
import { useStore } from '../store'
import { useEffect, useMemo } from 'react'

interface IFormInput {
  text: string
}

export default function Dashboard() {
  const { fetchTexts, texts } = useStore(state => state)
  const { tokens, refresh } = useAuth()
  const { control, handleSubmit } = useForm<IFormInput>({
    defaultValues: {
      text: '',
    },
  })

  useMemo(() => {
    fetchTexts(tokens.accessToken)
  }, [fetchTexts, tokens.accessToken])

  const onSubmit: SubmitHandler<IFormInput> = ({ text }) => {
    makeRequest<{ sentiment: string; probability: string }>(
      'sentiment-analysis/predict',
      'POST',
      { text },
      { Authorization: `Bearer ${tokens.accessToken}` }
    )
      .then(value => {
        console.log(`${value.sentiment} with ${value.probability} probability`)
        fetchTexts(tokens.accessToken)
      })
      .catch((errorStatus: number) => {
        if (errorStatus === 401) {
          refresh().then(newAccessToken =>
            makeRequest<{ sentiment: string; probability: string }>(
              'sentiment-analysis/predict',
              'POST',
              { text },
              { Authorization: `Bearer ${newAccessToken}` }
            ).then(value => {
              console.log(`${value.sentiment} with ${value.probability} probability`)
              fetchTexts(tokens.accessToken)
            })
          )
        }
      })
  }

  return (
    <>
      <Sidebar />
      <Stack height="100%" width="80%" justifyContent="space-around" alignItems="center">
        <Stack height="62%" width="90%" direction="row" justifyContent="space-between">
          <Box sx={{ height: '100%', width: '48%', borderRadius: 8, backgroundColor: 'white' }}>
            <Typography variant="h1" fontSize={18} marginX={4} marginTop={4} marginBottom={2}>
              Analyze sentiment
            </Typography>
            <Box
              component="form"
              noValidate
              autoComplete="off"
              width="90%"
              height="80%"
              marginX="auto"
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
                  <TextField
                    type="text"
                    label="Message"
                    sx={{ width: '100%' }}
                    multiline
                    minRows={14}
                    maxRows={14}
                    {...field}
                  />
                )}
              />
              <Button type="submit" sx={{ m: 1 }}>
                SEND
              </Button>
            </Box>
          </Box>
          <Box sx={{ height: '100%', width: '48%', borderRadius: 8, backgroundColor: 'white' }}>
            <Typography variant="h1" fontSize={18} marginX={4} marginTop={4} marginBottom={2}>
              Visualization
            </Typography>
          </Box>
        </Stack>
        <Box sx={{ height: '30%', width: '90%', borderRadius: 8, backgroundColor: 'white' }}>
          <Typography variant="h1" fontSize={18} marginX={4} marginTop={4} marginBottom={2}>
            Messages
          </Typography>
          <DataTable rows={texts} />
        </Box>
      </Stack>
    </>
  )
}
