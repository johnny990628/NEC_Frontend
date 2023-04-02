import React, { useEffect, useRef, useState } from 'react'
import {
    Box,
    Button,
    Divider,
    Grid,
    List,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    Stack,
    ToggleButton,
    ToggleButtonGroup,
} from '@mui/material'
import Avatar, { genConfig } from 'react-nice-avatar'
import { Check, Close, ClearOutlined, ArrowForwardIosOutlined } from '@mui/icons-material'
import { useTheme } from '@mui/styles'
import useStyles from './Style'

import { useDispatch, useSelector } from 'react-redux'

import CustomReportForm from '../../Components/CustomReport/CustomReportForm'
import REPORTCOLS from '../../Assets/Json/ReportCols.json'
import REPORTCOLS2 from '../../Assets/Json/ReportCols2.json'

import {
    resetReport,
    setupSchedule,
    updateReport,
    fetchReportByReportID,
    finishReport,
} from '../../Redux/Slices/ReportForm'

import { fetchSchedule, removeSchedule, removeScheduleByID } from '../../Redux/Slices/Schedule'

import PROCEDURECODE from '../../Assets/Json/ProcedureCode.json'
import { openAlert } from '../../Redux/Slices/Alert'
import { deleteReport } from '../../Redux/Slices/Report'

const CreateReport = () => {
    const [selection, setSelection] = useState(null)
    const [schedule, setSchedule] = useState({})
    const [scheduleList, setScheduleList] = useState([])
    const [status, setStatus] = useState('wait-examination')
    const { schedules } = useSelector((state) => state.schedule)

    const dispatch = useDispatch()
    const classes = useStyles()

    useEffect(() => {
        if (selection) {
            const schedule = schedules.find((s) => s._id === selection)

            setSchedule(schedule)
            dispatch(setupSchedule(schedule))
            if (schedule.status === 'wait-finish' || schedule.status === 'finish') {
                dispatch(fetchReportByReportID({ reportID: schedule.reportID }))
            }
        } else {
            setSchedule({})
            dispatch(resetReport())
        }
    }, [selection])

    useEffect(() => {
        setScheduleList(schedules.filter((schedule) => schedule.status === status))
    }, [status, schedules])

    useEffect(() => {
        dispatch(fetchSchedule({ status: '' }))

        return () => {
            dispatch(updateReport())
        }
    }, [])

    const handleReportSave = () => {
        dispatch(updateReport())
        setSelection(null)
    }
    const handleReportSubmit = () => {
        dispatch(finishReport())
        setSelection(null)
    }

    const handleSelectionClick = (id) => {
        if (id === selection) setSelection(null)
        else setSelection(id)
    }
    const handleStatusChange = (event, newAlignment) => {
        setStatus(newAlignment)
    }
    const deleteReportAndSchedule = () => {
        if (schedule.status === 'wait-examination') {
            dispatch(
                openAlert({
                    alertTitle: '確定刪除該報告?',
                    toastTitle: '刪除成功',
                    icon: 'success',
                    type: 'confirm',
                    event: () => {
                        dispatch(removeSchedule(schedule.patientID))
                        setSelection(null)
                    },
                })
            )
        }
        if (schedule.status === 'wait-finish' || schedule.status === 'finish') {
            dispatch(
                openAlert({
                    alertTitle: '確定刪除該報告?',
                    toastTitle: '刪除成功',
                    icon: 'success',
                    type: 'confirm',
                    event: () => {
                        dispatch(removeScheduleByID({ reportID: schedule.reportID, scheduleID: schedule._id }))
                        setSelection(null)
                    },
                })
            )
        }
    }

    return (
        <Grid container spacing={2} sx={{ height: '100%' }}>
            <Grid item xs={3}>
                <ToggleButtonGroup color="primary" value={status} exclusive onChange={handleStatusChange}>
                    <ToggleButton value="wait-examination">待打報告</ToggleButton>
                    <ToggleButton value="wait-finish">未完成報告</ToggleButton>
                    <ToggleButton value="finish">已完成報告</ToggleButton>
                </ToggleButtonGroup>
                <List>
                    {scheduleList &&
                        scheduleList.map((schedule) => {
                            const { id: patientID, name } = schedule.patient
                            const { _id: scheduleID, procedureCode, updatedAt } = schedule
                            const config = genConfig(patientID)
                            return (
                                <Box key={scheduleID}>
                                    <ListItemButton
                                        selected={selection === scheduleID}
                                        onClick={() => handleSelectionClick(scheduleID)}
                                    >
                                        <ListItemAvatar>
                                            <Avatar style={{ width: '3rem', height: '3rem' }} {...config}></Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            sx={{ ml: 1 }}
                                            primary={<Box sx={{ fontSize: '1.6rem' }}>{name}</Box>}
                                            secondary={
                                                <Stack>
                                                    <Box>{patientID}</Box>
                                                    <Box>{new Date(updatedAt).toLocaleTimeString()}</Box>
                                                </Stack>
                                            }
                                        ></ListItemText>
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <Box className={`${classes.status} ${procedureCode === '19014C' && 'yet'}`}>
                                                {PROCEDURECODE[procedureCode]}
                                            </Box>
                                            <ArrowForwardIosOutlined fontSize="1rem" sx={{ color: 'text.gray' }} />
                                        </Stack>
                                    </ListItemButton>
                                    <Divider />
                                </Box>
                            )
                        })}
                </List>
            </Grid>
            <Grid item xs={9}>
                {selection && (
                    <Box sx={{ height: '100%' }}>
                        <Box sx={{ width: '100%', height: '1%', display: 'flex', justifyContent: 'end' }}>
                            {schedule?.status === 'wait-examination' && (
                                <Button
                                    variant="outlined"
                                    startIcon={<Check />}
                                    sx={{ borderRadius: '2rem', height: '2.5rem', marginRight: '1rem' }}
                                    onClick={handleReportSave}
                                >
                                    暫存報告
                                </Button>
                            )}

                            <Button
                                variant="contained"
                                startIcon={<Check />}
                                sx={{ borderRadius: '2rem', height: '2.5rem', marginRight: '1rem' }}
                                onClick={handleReportSubmit}
                            >
                                完成報告
                            </Button>

                            <Button
                                variant="contained"
                                color="red"
                                startIcon={<Close />}
                                sx={{
                                    borderRadius: '2rem',
                                    height: '2.5rem',
                                    color: 'secondary.main',
                                }}
                                onClick={deleteReportAndSchedule}
                            >
                                刪除報告
                            </Button>
                        </Box>
                        <CustomReportForm cols1={REPORTCOLS} cols2={REPORTCOLS2} schedule={schedule} mode="create" />
                    </Box>
                )}
            </Grid>
        </Grid>
    )
}

export default CreateReport
