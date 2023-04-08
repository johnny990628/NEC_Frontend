import React, { useEffect, useState } from 'react'

import { Box, Grid, List, ListItem, Typography, ListSubheader } from '@mui/material'

import Main from './component/Main'
import MarkEdit from './component/MarkEdit'
import DataShows from './component/DataShows'
import { listText } from './js/calculate'

function ChestMarker({}) {
    const [azimut, setAzimut] = useState({
        L: [],
        R: [],
    })

    const [onEditMark, setOnEditMark] = useState({ side: 'L', index: 0 })

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={5}>
                <Grid container item xs={12}>
                    {['R', 'L'].map((side) => {
                        return (
                            <Grid item xs={6} key={side} flex justifyContent="center" alignItems="center">
                                <Main side={side} azimut={azimut} setAzimut={setAzimut} setOnEditMark={setOnEditMark} />
                            </Grid>
                        )
                    })}
                </Grid>
                <Grid container item xs={12}>
                    {['R', 'L'].map((side) => {
                        return (
                            <Grid item xs={6}>
                                <DataShows azimut={azimut} side={side} />
                            </Grid>
                        )
                    })}
                </Grid>
            </Grid>
            <MarkEdit azimut={azimut} setAzimut={setAzimut} onEditMark={onEditMark} setOnEditMark={setOnEditMark} />
        </Box>
    )
}

export default ChestMarker
