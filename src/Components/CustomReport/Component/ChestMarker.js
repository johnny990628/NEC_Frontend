import React from 'react'

import { Box, Grid } from '@mui/material'
import DataShows from './component/DataShows'
import { useSelector } from 'react-redux'

function ChestMarker({}) {
    const { report } = useSelector((state) => state.breast)

    const Circle = ({ pos }) => (
        <svg width="400" height="400">
            <circle cx="200" cy="200" r="200" fill="#efefef" />
            {pos.map(({ id, x, y, size }) => (
                <circle key={id} cx={x} cy={y} r={size * 10} fill="red" />
            ))}
        </svg>
    )
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={5}>
                <Grid item xs={6} display="flex" justifyContent="center" alignItems="center" mt={2}>
                    <Circle pos={report['L']} />
                </Grid>
                <Grid item xs={6} display="flex" justifyContent="center" alignItems="center" mt={2}>
                    <Circle pos={report['R']} />
                </Grid>
                <Grid container item xs={12}>
                    {['L', 'R'].map((side) => {
                        return (
                            <Grid key={side} item xs={6} sx={{ pl: 3 }}>
                                <DataShows side={side} />
                            </Grid>
                        )
                    })}
                </Grid>
            </Grid>
        </Box>
    )
}

export default ChestMarker
