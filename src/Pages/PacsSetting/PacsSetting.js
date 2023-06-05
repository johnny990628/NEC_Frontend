import React, { useEffect, useCallback, useState } from 'react'
import { Box, Button, IconButton, List, ListItem } from '@mui/material'
import moment from 'moment'
import useStyles from './Style'

import { useDispatch, useSelector } from 'react-redux'
import { fetchDicom } from '../../Redux/Slices/Dicom'
import { fetchPacsSetting } from '../../Redux/Slices/PacsSetting'

import useAlert from '../../Hooks/useAlert'
import { CheckCircleOutline, InsertPhotoOutlined } from '@mui/icons-material'
import PacsServer from '../../Components/PacsSetting/PacsServer/PacsServer'

const PacsSetting = () => {
    const dispatch = useDispatch()
    const classes = useStyles()
    const [pacsServerList, setPacsServerList] = useState([])
    const { results, count, page, loading } = useSelector((state) => state.dicom)

    const fetchData = async () => {
        dispatch(fetchPacsSetting())
    }

    useEffect(() => {
        fetchData()
    }, [])

    const showAlert = useAlert()

    const PacsSettingList = [
        {
            HeaderTitle: 'PACS Server',
            headerValue: '各項PACS server 參數設定，拖動Card排序權重比。',
            body: <PacsServer />,
        },
    ]

    return (
        <Box className={classes.container}>
            {PacsSettingList.map((PacsSettingItem, index) => {
                return (
                    <Box className={classes.Item}>
                        <Box className={classes.header} key={PacsSettingItem.HeaderTitle}>
                            <Box className={classes.HeaderTitle}>{PacsSettingItem.HeaderTitle}</Box>
                            <Box className={classes.headerValue}>{PacsSettingItem.headerValue}</Box>
                        </Box>
                        <Box>{PacsSettingItem.body}</Box>
                    </Box>
                )
            })}
        </Box>
    )
}

export default PacsSetting
