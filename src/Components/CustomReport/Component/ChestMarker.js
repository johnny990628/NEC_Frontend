import React, { useEffect, useState } from 'react'

import { Box, Grid, List, ListItem, Typography, ListSubheader } from '@mui/material'

import Main from './component/Main'
import MarkEdit from './component/MarkEdit'
import DataShows from './component/DataShows'
import { listText } from './js/calculate'

function ChestMarker({ handleChange, value, Modalopen }) {
  const [azimut, setAzimut] = useState({
    L: [],
    R: [],
  })

  const [open, setOpen] = useState(false)
  const EditModalOpen = () => setOpen(true)
  const EditModalClose = () => setOpen(false)
  const [onEditMark, setOnEditMark] = useState({ side: 'L', index: 0 })

  useEffect(() => {
    handleChange(JSON.stringify(azimut))
  }, [azimut])

  //最大modal
  useEffect(() => {
    setAzimut(value ? JSON.parse(value) : { L: [], R: [] })
  }, [Modalopen])

  //edit modal
  useEffect(() => {
    handleChange(JSON.stringify(azimut))
  }, [open])

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={3}>
        <Grid item xs={3} md={3}>
          {['R', 'L'].map((side) => {
            return <DataShows azimut={azimut} side={side} />
          })}
        </Grid>
        {['R', 'L'].map((side) => {
          return (
            <Grid item xs={4} md={4} key={side}>
              <Main
                side={side}
                azimut={azimut}
                setAzimut={setAzimut}
                EditModalOpen={EditModalOpen}
                setOnEditMark={setOnEditMark}
              />
            </Grid>
          )
        })}
      </Grid>
      <MarkEdit
        azimut={azimut}
        setAzimut={setAzimut}
        open={open}
        EditModalClose={EditModalClose}
        EditModalOpen={EditModalOpen}
        onEditMark={onEditMark}
        setOnEditMark={setOnEditMark}
      />
    </Box>
  )
}

export default ChestMarker
