import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { IText } from '../store'

type DataTableProps = {
  rows: IText[]
}

export default function DataTable({ rows }: DataTableProps) {
  return (
    <TableContainer sx={{ width: '96%', marginX: 'auto', maxHeight: 150 }}>
      <Table aria-label="Predicted sentiments">
        <TableHead>
          <TableRow>
            <TableCell>Text</TableCell>
            <TableCell align="right">Sentiment</TableCell>
            <TableCell align="right">Probability</TableCell>
            <TableCell align="right">Id</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow key={row.textId} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">
                {row.text}
              </TableCell>
              <TableCell align="right">{row.sentiment}</TableCell>
              <TableCell align="right">{row.probability}</TableCell>
              <TableCell align="right">{row.textId}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
