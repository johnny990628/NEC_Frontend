import React, { useEffect, useState } from 'react'
import { Box, Button, IconButton, List, ListItem } from '@mui/material'
import moment from 'moment'
import useStyles from './Style'

import { useDispatch, useSelector } from 'react-redux'
import { fetchDicom } from '../../Redux/Slices/Dicom'

import useAlert from '../../Hooks/useAlert'
import { CheckCircleOutline, InsertPhotoOutlined } from '@mui/icons-material'

const Setting = () => {
    const dispatch = useDispatch()
    const classes = useStyles()
    const { results, count, page, loading } = useSelector((state) => state.dicom)

    const fetchData = async (params) => {
        dispatch(fetchDicom(params))
    }

    const showAlert = useAlert()

    return (
        <Box className={classes.container}>
            <List className={classes.list}>
                <ListItem className={classes.listItem} key={1}>
                    <Box className={classes.icon}>
                        <InsertPhotoOutlined />
                    </Box>
                    <Box className={classes.text}>PACS 設定</Box>
                </ListItem>

                <ListItem className={classes.listItem} key={2}>
                    <Box className={classes.icon}>
                        <CheckCircleOutline />
                    </Box>
                </ListItem>
            </List>
        </Box>
    )
}

export default Setting
