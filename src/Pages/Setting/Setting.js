import React, { useEffect, useState } from 'react'
import { Box, Button, IconButton, List, ListItem } from '@mui/material'
import moment from 'moment'
import useStyles from './Style'

import CustomTable from '../../Components/CustomTable/CustomTable'
import ReportDialog from '../../Components/ReportDialog/ReportDialog'
import GlobalFilterParams from '../../Components/GlobalFilterParams/GlobalFilterParams'
import { CloudDownload } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDicom } from '../../Redux/Slices/Dicom'
import { apiDownloadDCM } from '../../Axios/Dicom'

import filterParams from '../../Assets/Json/FilterParams.json'
import useAlert from '../../Hooks/useAlert'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { CheckCircleOutline, InsertPhotoOutlined } from '@mui/icons-material'
import CustomScrollbar from '../../Components/CustomScrollbar/CustomScrollbar'
import User from '../User/User.js'
import PacsSetting from '../PacsSetting/PacsSetting.js'
import Image from '../Image/Image'

const settingRouters = [
    {
        id: 1,
        name: 'PACS 設定',
        icon: InsertPhotoOutlined,
        body: <PacsSetting />,
    },
    {
        id: 2,
        name: '用戶設定',
        icon: CheckCircleOutline,
        body: <User />,
    },
    {
        id: 3,
        name: '影像設定',
        icon: CheckCircleOutline,
        body: <Image />,
    },
]
const Setting = () => {
    const dispatch = useDispatch()
    const classes = useStyles()
    const { results, count, page, loading } = useSelector((state) => state.dicom)

    const [focusRouter, setFocusRouter] = useState(settingRouters[0])
    const fetchData = async (params) => {
        dispatch(fetchDicom(params))
    }

    const showAlert = useAlert()

    const handleFocusRouter = (id) => {
        setFocusRouter(settingRouters.find((router) => router.id === id))
    }

    return (
        <Box className={classes.container}>
            <List className={classes.list}>
                {settingRouters.map((router) => {
                    const Icon = router.icon
                    return (
                        <ListItem
                            className={classes.listItem}
                            key={router.id}
                            style={{ background: focusRouter.id === router.id ? '#e8e8e8' : null }}
                            onClick={() => handleFocusRouter(router.id)}
                        >
                            <Box className={classes.icon}>
                                <Icon />
                            </Box>
                            <Box className={classes.text}>{router.name}</Box>
                        </ListItem>
                    )
                })}
            </List>
            <Box className={classes.content}>
                <Box className={classes.header}>
                    <Box className={classes.title}>{focusRouter.name}</Box>
                </Box>
                <Box className={classes.body}>
                    {/* <CustomScrollbar></CustomScrollbar> */}
                    {focusRouter.body}
                </Box>
            </Box>
        </Box>
    )
}

export default Setting
