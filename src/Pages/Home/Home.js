import React, { useEffect, useMemo, useState } from 'react'
import { Grid, Box } from '@mui/material'

import { useDispatch, useSelector } from 'react-redux'

import Progressbar from '../../Components/Progressbar/Progressbar'
import useStyles from './Style'
import LittleTable from '../../Components/LittleTable/LittleTable'
import { fetchDashboard } from '../../Redux/Slices/Dashboard'
import CustomScrollbar from '../../Components/CustomScrollbar/CustomScrollbar'

const Home = () => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const { patients, reports, schedules, count } = useSelector((state) => state.dashboard)

    const patientCol = useMemo(
        () => [
            { accessor: 'id', Header: '身分證字號' },
            { accessor: 'name', Header: '姓名' },
            { accessor: 'gender', Header: '性別' },
        ],
        []
    )
    const scheduleCol = useMemo(
        () => [
            { accessor: 'patientID', Header: '身分證字號' },
            { accessor: 'procedureCode', Header: '醫令代碼' },
        ],
        []
    )
    const reportCol = useMemo(
        () => [
            { accessor: 'patientID', Header: '身分證字號' },
            { accessor: 'updatedAt', Header: '完成日期' },
        ],
        []
    )

    useEffect(() => {
        dispatch(fetchDashboard())
    }, [])

    return (
        <CustomScrollbar>
            <Grid container spacing={2} sx={{ height: '100%' }}>
                <Grid item md={12} xl={8} spacing={2}>
                    <Grid container spacing={2}>
                        <Grid item xs={6} lg={4}>
                            <Box className={classes.box}>
                                <LittleCard title={'等待檢查'} value={count.waitExamination} total={count.patient} />
                            </Box>
                        </Grid>
                        <Grid item xs={6} lg={4}>
                            <Box className={classes.box}>
                                <LittleCard title={'代打報告'} value={count.waitFinish} total={count.patient} />
                            </Box>
                        </Grid>
                        <Grid item xs={6} lg={4}>
                            <Box className={classes.box}>
                                <LittleCard title={'病患人數'} value={count.patient} total={count.patient} />
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Box className={classes.box}>
                                <LittleTable title={'病患名單'} rows={patients} cols={patientCol} route={'/patient'} />
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item md={12} xl={4}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Box className={classes.box}>
                                <LittleTable title={'尚未檢查'} rows={schedules} cols={scheduleCol} route={'/report'} />
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Box className={classes.box}>
                                <LittleTable title={'目前報告'} rows={reports} cols={reportCol} route={'/report'} />
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </CustomScrollbar>
    )
}

const LittleCard = ({ title, value, total }) => {
    const classes = useStyles()

    return (
        <Box className={classes.cardContainer}>
            <Box className={classes.cardHeader}>
                <Progressbar value={value} total={total} />
            </Box>
            <Box className={classes.cardBody}>
                <Box className={classes.cardTopic}>{title}</Box>
            </Box>
        </Box>
    )
}
export default Home
