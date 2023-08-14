import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Box } from '@mui/material'

import useStyles from './Style'

import Router from '../Router'
import Sidebar from '../Sidebar/Sidebar'
import CustomScrollbar from '../CustomScrollbar/CustomScrollbar'
import { HashRouter } from 'react-router-dom'

const Layout = () => {
    const classes = useStyles()

    const { isOpen } = useSelector((state) => state.sidebar)

    return (
        <HashRouter>
            <Box sx={{ height: '100vh', display: 'flex' }}>
                <Sidebar />
                <CustomScrollbar>
                    <Box className={`${classes.container} ${isOpen || 'close'}`}>
                        <Router />
                    </Box>
                </CustomScrollbar>
            </Box>
        </HashRouter>
    )
}

export default Layout
