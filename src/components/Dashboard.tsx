import { Stack, TextField, Box, Button, Typography, CircularProgress } from '@mui/material'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { makeRequest } from '../helpers/makeRequest'
import { useAuth } from '../auth/AuthProvider'
import Sidebar from './Sidebar'
import DataTable from './DataTable'
import { useStore } from '../store'
import { useMemo, useState } from 'react'
import TypeIt from 'typeit-react'
import { Visualization } from './Visualization'

interface IFormInput {
  text: string
}

export default function Dashboard() {
  const [prediction, setPrediction] = useState('')
  const [sendClicked, setSendClicked] = useState(false)
  const { fetchTexts, texts } = useStore(state => state)
  const { tokens, refresh } = useAuth()
  const { control, handleSubmit } = useForm<IFormInput>({
    defaultValues: {
      text: '',
    },
  })

  useMemo(() => {
    fetchTexts(tokens.accessToken)
  }, [tokens.accessToken])

  const onSubmit: SubmitHandler<IFormInput> = ({ text }) => {
    setPrediction('')
    setSendClicked(true)
    makeRequest<{ sentiment: string; probability: string }>('sentiment-analysis/predict', {
      method: 'POST',
      body: { text },
      headers: { Authorization: `Bearer ${tokens.accessToken}` },
    })
      .then(value => {
        setPrediction(`${value.sentiment} - ${value.probability}`)
        setSendClicked(false)
        setTimeout(() => fetchTexts(tokens.accessToken), 1000)
      })
      .catch((errorStatus: number) => {
        if (errorStatus === 401) {
          refresh().then(newAccessToken =>
            makeRequest<{ sentiment: string; probability: string }>('sentiment-analysis/predict', {
              method: 'POST',
              body: { text },
              headers: { Authorization: `Bearer ${newAccessToken}` },
            }).then(value => {
              setPrediction(`${value.sentiment} - ${value.probability}`)
              setSendClicked(false)
              setTimeout(() => fetchTexts(tokens.accessToken), 1000)
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
              <Stack direction="row" mt={1} width="100%" justifyContent="space-between" alignItems="center">
                <Typography variant="h1" fontSize={16} fontWeight="400" color="primary">
                  {prediction ? (
                    <TypeIt>
                      <b>PREDICTED</b> : <em>{prediction}</em>
                    </TypeIt>
                  ) : (
                    sendClicked && <CircularProgress size={20} />
                  )}
                </Typography>
                <Button sx={{ px: 4 }} type="submit" variant="contained">
                  SEND
                </Button>
              </Stack>
            </Box>
          </Box>
          <Box sx={{ height: '100%', width: '48%', borderRadius: 8, backgroundColor: 'white' }}>
            <Typography variant="h1" fontSize={18} marginX={4} marginTop={4} marginBottom={2}>
              Visualization
            </Typography>
            <Visualization />
          </Box>
        </Stack>
        <Box sx={{ height: '30%', width: '90%', borderRadius: 8, backgroundColor: 'white' }}>
          <Typography variant="h1" fontSize={18} marginX={4} marginTop={4} marginBottom={2}>
            Messages
          </Typography>
          <DataTable rows={texts.sort((a, b) => b.textId - a.textId)} />
        </Box>
      </Stack>
    </>
  )
}
