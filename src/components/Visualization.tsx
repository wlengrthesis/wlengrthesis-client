import { Box } from '@mui/material'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { useStore } from '../store'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const options = {
  responsive: true,
  scales: {
    x: {
      display: true,
      title: {
        display: true,
        text: 'Probability',
      },
    },
  },
  plugins: {
    legend: {
      position: 'top' as const,
    },
  },
}

const labels = ['> 70%', '< 70 %']

export function Visualization() {
  const texts = useStore(state => state.texts)

  const positiveSentiment = texts.filter(text => text.sentiment === 'positive')
  const negativeSentiment = texts.filter(text => text.sentiment === 'negative')

  const data = {
    labels,
    datasets: [
      {
        label: 'Positive sentiment',
        data: [
          positiveSentiment.filter(text => Number(text.probability.slice(0, -1)) > 70).length,
          positiveSentiment.filter(text => Number(text.probability.slice(0, -1)) < 70).length,
        ],
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: 'Negative sentiment',
        data: [
          negativeSentiment.filter(text => Number(text.probability.slice(0, -1)) > 70).length,
          negativeSentiment.filter(text => Number(text.probability.slice(0, -1)) < 70).length,
        ],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  }

  return (
    <Box p={1} mt={8}>
      <Bar options={options} data={data} />
    </Box>
  )
}
