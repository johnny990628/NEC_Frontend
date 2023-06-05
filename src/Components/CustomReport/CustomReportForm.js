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
        <Box className={classes.container}>
            <CustomScrollbar>
                <ChestMarker />
            </CustomScrollbar>
        </Box>
    )
}

export default CustomReportForm
