import React from 'react'

import { Box, Grid, Tooltip } from '@mui/material'
import DataShows from './DataShows'
import { useSelector } from 'react-redux'

function ChestMarker({}) {
    const { report, CHESTMAXSIZE, CHESTMAXRADIUS } = useSelector((state) => state.breast)
    const lines = Array.from({ length: 12 }).map((_, i) => {
        const angle = i * 30
        const x = 200 + Math.sin((angle * Math.PI) / 180) * 200
        const y = 200 - Math.cos((angle * Math.PI) / 180) * 200
        return { x, y }
    })

    const Circle = ({ pos, side }) => {
        return (
            <svg width="400" height="400">
                <circle cx="200" cy="200" r="200" fill="#efefef" />
                <circle cx="200" cy="200" r="200" fill="#efefef" />

                {lines.map(({ x, y }, i) => (
                    <line key={i} x1="200" y1="200" x2={x} y2={y} stroke="black" strokeWidth="0.5" />
                ))}

                {pos.map(({ id, clock, distance, size }, index) => {
                    const angle = (clock * 360) / 12 + 180
                    const radians = (angle * Math.PI) / 180
                    const x = CHESTMAXSIZE - Math.sin(radians) * distance * (CHESTMAXSIZE / CHESTMAXRADIUS)
                    const y = CHESTMAXSIZE + Math.cos(radians) * distance * (CHESTMAXSIZE / CHESTMAXRADIUS)

                    return (
                        <Tooltip key={id} title={`${side}${index + 1}`}>
                            <circle cx={x} cy={y} r={size * 10} fill="red" />
                        </Tooltip>
                    )
                })}
            </svg>
        )
    }
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={5}>
                <Grid item xs={6} display="flex" justifyContent="center" alignItems="center" mt={2}>
                    <Circle pos={report['L']} side={'L'} />
                </Grid>
                <Grid item xs={6} display="flex" justifyContent="center" alignItems="center" mt={2}>
                    <Circle pos={report['R']} side={'R'} />
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
