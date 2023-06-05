import React, { useState, useEffect, useMemo } from 'react'
import { Box, Grid } from '@mui/material'
import { useTheme } from '@mui/styles'
import useStyles from './Style'

import CustomScrollbar from '../../Components/CustomScrollbar/CustomScrollbar'

import ChestMarker from './Component/ChestMarker'

const CustomReportForm = ({}) => {
    const classes = useStyles()
    const theme = useTheme()

    return (
        <>
            <Box className={classes.container}>
                <Grid container sx={{ height: '100%' }}>
                    <Grid item xs={12}>
                        <CustomScrollbar>
                            <ChestMarker />
                        </CustomScrollbar>
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}

export default CustomReportForm
