import { Box, Grid, List, ListItem, Typography, ListSubheader } from '@mui/material'
import { listText } from '../js/calculate'

const DataShows = ({ azimut, side }) => {
  return (
    <Box style={{ textAlign: 'left' }}>
      <h3>{side}</h3>
      <ul dense={true}>
        {azimut[side].length > 0
          ? azimut[side].map((item, index) => {
              return <li key={index}>{listText(item)}</li>
            })
          : null}
      </ul>
    </Box>
  )
}

export default DataShows
