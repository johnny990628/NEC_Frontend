import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogContent,
    Divider,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    List,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    MenuItem,
    Select,
    Stack,
    TextField,
} from '@mui/material'
import Avatar, { genConfig } from 'react-nice-avatar'
import {
    Check,
    Close,
    ClearOutlined,
    ArrowForwardIosOutlined,
    DateRange,
    ArrowLeft,
    ArrowRight,
    Search,
} from '@mui/icons-material'
import { useTheme } from '@mui/styles'
import { zhTW } from 'date-fns/locale'
import { addDays, format, parseISO } from 'date-fns'

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
    setupReport,
    finishReport,
    setupBirads,
} from '../../Redux/Slices/Breast'

import { fetchSchedule, removeSchedule, removeScheduleByID, setupDate } from '../../Redux/Slices/Schedule'

import PROCEDURECODE from '../../Assets/Json/ProcedureCode.json'
import { deleteReport } from '../../Redux/Slices/Report'
import CustomScrollbar from '../../Components/CustomScrollbar/CustomScrollbar'
import useAlert from '../../Hooks/useAlert'
import { DayPicker } from 'react-day-picker'
import { useDebouncedCallback } from 'use-debounce'

const CreateReport = () => {
    const [selection, setSelection] = useState(null)
    const [schedule, setSchedule] = useState({})
    const [scheduleList, setScheduleList] = useState([])
    const [status, setStatus] = useState('wait-examination')
    const [version, setVersion] = useState('')
    const [report, setReport] = useState({})
    const [number, setNumber] = useState({})
    const [date, setDate] = useState(new Date())
    const [searchText, setSearchText] = useState('')
    const [search, setSearch] = useState('')
    const [dateDialogOpen, setDateDialogOpen] = useState(false)

    const { schedules, loading, count } = useSelector((state) => state.schedule)
    const { birads } = useSelector((state) => state.breast)

    const dispatch = useDispatch()
    const classes = useStyles()
    const showAlert = useAlert()
    const theme = useTheme()

    const initState = () => {
        setSelection(null)
        setSchedule({})
        setReport({})
        setVersion('')
        dispatch(resetReport())
    }

    const handleSelectionChange = () => {
        const currentSchedule = schedules.find((s) => s._id === selection)
        if (!currentSchedule) {
            initState()
            return
        }
        setSchedule(currentSchedule)
        const currentReport = currentSchedule?.report
        setReport(currentReport)
        dispatch(setupSchedule(currentSchedule))

        if (currentSchedule.status === 'wait-finish' || currentSchedule.status === 'finish') {
            if (currentReport) {
                setVersion(currentReport?.records[currentReport.records.length - 1].id)
                dispatch(fetchReportByReportID({ reportID: currentSchedule.reportID }))
            }
        }
    }

    useEffect(() => {
        handleSelectionChange()
    }, [selection, schedules])

    useEffect(() => {
        if (version) {
            const currentRecord = report.records.find((record) => record.id === version)
            if (currentRecord) dispatch(setupReport(currentRecord.report))
        }
    }, [version])

    useEffect(() => {
        setScheduleList(
            schedules.filter((schedule) => (status === 'all' ? true : schedule.status === status)).reverse()
        )
        const numbers = schedules.reduce(
            (acc, cur) => {
                return { ...acc, all: acc['all'] + 1, [cur.status]: acc[cur.status] + 1 }
            },
            {
                all: 0,
                'wait-examination': 0,
                'wait-finish': 0,
                finish: 0,
            }
        )
        setNumber(numbers)
    }, [status, schedules])

    useEffect(() => {
        const dateFrom = date.toLocaleDateString()
        const dateTo = new Date(addDays(date, 1)).toLocaleDateString()

        dispatch(fetchSchedule({ dateFrom, dateTo, search }))
    }, [date, count, search])

    const handleSearch = useDebouncedCallback((text) => {
        setSearch(text)
    }, 500)

    const handleReportSave = () => {
        dispatch(updateReport())
        showAlert({ toastTitle: '暫存報告', text: `${schedule.patient.name}`, icon: 'success' })
        setSelection(null)
    }
    const handleReportSubmit = () => {
        dispatch(finishReport())
        showAlert({ toastTitle: '儲存報告', text: `${schedule.patient.name}`, icon: 'success' })
        setSelection(null)
    }

    const deleteReportAndSchedule = () => {
        if (schedule.status === 'wait-examination') {
            showAlert({
                alertTitle: '確定刪除該報告?',
                toastTitle: '刪除成功',
                icon: 'success',
                type: 'confirm',
                event: () => dispatch(removeSchedule(schedule.patientID)),
            })
        }
        if (schedule.status === 'wait-finish' || schedule.status === 'finish') {
            showAlert({
                alertTitle: '確定刪除該報告?',
                toastTitle: '刪除成功',
                icon: 'success',
                type: 'confirm',
                event: () => dispatch(removeScheduleByID({ reportID: schedule.reportID, scheduleID: schedule._id })),
            })
        }
    }

    const handleSelectionClick = (id) => {
        if (id === selection) setSelection(null)
        else setSelection(id)
    }
    const handleStatusChange = (event, newAlignment) => {
        setStatus(newAlignment)
    }

    const handleVersionOnChange = (e) => {
        setVersion(e.target.value)
    }

    const handleBiradsChange = (e) => {
        dispatch(setupBirads(e.target.value))
    }

    const badgeColor = (status) => {
        switch (status) {
            case 'wait-examination':
                return 'red'
            case 'wait-finish':
                return 'yellow'
            case 'finish':
                return 'green'
            default:
                return ''
        }
    }

    const handleStatusClick = (status) => {
        setStatus(status)
    }

    const handleDateSelect = (range) => {
        setDate(range)
    }
    const handleDialogClose = () => {
        setDateDialogOpen(false)
    }

    const statusList = useMemo(
        () => [
            { text: 'all', title: '所有報告' },
            { text: 'wait-examination', title: '待打報告' },
            { text: 'wait-finish', title: '暫存報告' },
            { text: 'finish', title: '完成報告' },
        ],
        []
    )

    return (
        <Grid container sx={{ overflowY: 'hidden', flexGrow: 1 }}>
            <Grid item xs={3}>
                <Stack>
                    <Box display="flex" justifyContent="space-between" className={classes.listContainer} mb={2}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Search sx={{ color: 'gray.main', mr: 0.5 }} />
                            <TextField
                                variant="standard"
                                sx={{ width: '90%' }}
                                value={searchText}
                                onChange={(e) => {
                                    setSearchText(e.target.value)
                                    handleSearch(e.target.value)
                                }}
                            />
                        </Box>
                        <Box display="flex" flexDirection="column" alignItems="flex-end">
                            <Box display="flex" alignItems="center">
                                <IconButton
                                    sx={{ color: 'gray.main' }}
                                    onClick={() => setDate((date) => addDays(date, -1))}
                                >
                                    <ArrowLeft />
                                </IconButton>
                                <Box
                                    sx={{ fontSize: '1.2rem', color: 'gray.main' }}
                                    onClick={() => setDateDialogOpen(true)}
                                >
                                    {new Date(date).toLocaleDateString()}
                                </Box>

                                <IconButton
                                    sx={{ color: 'gray.main' }}
                                    onClick={() => setDate((date) => addDays(date, 1))}
                                >
                                    <ArrowRight />
                                </IconButton>
                            </Box>
                        </Box>
                    </Box>

                    <Box className={classes.listContainer} sx={{ height: '86vh' }}>
                        <List sx={{ overflowY: 'auto', height: '80%' }}>
                            <CustomScrollbar>
                                {scheduleList &&
                                    scheduleList.map((schedule) => {
                                        const { id: patientID, name } = schedule.patient
                                        const { _id: scheduleID, procedureCode, updatedAt, status } = schedule
                                        const config = genConfig(patientID)
                                        return (
                                            <Box
                                                key={scheduleID}
                                                sx={{
                                                    borderLeft: '4px solid ',
                                                    borderColor: theme.palette[badgeColor(status)].main,
                                                }}
                                            >
                                                <ListItemButton
                                                    selected={selection === scheduleID}
                                                    onClick={() => handleSelectionClick(scheduleID)}
                                                >
                                                    <ListItemAvatar>
                                                        <Avatar
                                                            style={{
                                                                width: '3rem',
                                                                height: '3rem',
                                                            }}
                                                            {...config}
                                                        ></Avatar>
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        sx={{ ml: 1 }}
                                                        primary={
                                                            <Box display="flex">
                                                                <Box sx={{ fontSize: '1.6rem' }}>{name}</Box>
                                                            </Box>
                                                        }
                                                        secondary={
                                                            <Stack>
                                                                <Box>{patientID}</Box>
                                                                <Box>{new Date(updatedAt).toLocaleTimeString()}</Box>
                                                            </Stack>
                                                        }
                                                    ></ListItemText>
                                                    <Stack direction="row" alignItems="center" spacing={1}>
                                                        {procedureCode && (
                                                            <Box
                                                                className={`${classes.status} ${
                                                                    procedureCode === '19014C' && 'yet'
                                                                }`}
                                                            >
                                                                {procedureCode}
                                                            </Box>
                                                        )}

                                                        <ArrowForwardIosOutlined
                                                            fontSize="1rem"
                                                            sx={{ color: 'text.gray' }}
                                                        />
                                                    </Stack>
                                                </ListItemButton>

                                                <Divider />
                                            </Box>
                                        )
                                    })}
                            </CustomScrollbar>
                        </List>

                        <Stack direction="row" justifyContent="center" spacing={0.5} mt={1} sx={{ height: '14%' }}>
                            {statusList.map(({ text, title }) => (
                                <Button
                                    key={text}
                                    className={classes.statusButton}
                                    variant={status === text ? 'outlined' : ''}
                                    color={status === text ? 'primary' : 'gray'}
                                    onClick={() => handleStatusClick(text)}
                                >
                                    <Box sx={{ color: 'text.gray' }}>{title}</Box>
                                    <Box className={classes.number}>{number[text]}</Box>
                                </Button>
                            ))}
                        </Stack>
                    </Box>
                </Stack>
                {/* <Box display="flex" sx={{ width: '100%' }} mb={2}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                        <Search sx={{ color: 'gray.main', mr: 1 }} />
                        <TextField
                            variant="standard"
                            sx={{ width: 300 }}
                            value={searchText}
                            onChange={(e) => {
                                setSearchText(e.target.value)
                                handleSearch(e.target.value)
                            }}
                        />
                    </Box>
                    <Box style={{ marginLeft: '1rem' }}>
                        {loading ? (
                            <CircularProgress color="primary" size={20} />
                        ) : (
                            <Box style={{ width: '20px' }}></Box>
                        )}
                    </Box>
                </Box> */}
            </Grid>
            <Grid item xs={8.8} className={classes.reportContainer}>
                {selection && (
                    <Box sx={{ height: '98%' }}>
                        <Box
                            sx={{
                                width: '100%',
                                height: '1%',
                                display: 'flex',
                                justifyContent: 'end',
                            }}
                        >
                            <FormControl variant="standard" sx={{ width: '8rem', mr: 2 }}>
                                <InputLabel id="select-birads">BI-RADS</InputLabel>
                                <Select labelId="select-birads" value={birads} onChange={handleBiradsChange}>
                                    {[1, 2, 3, 4, 5, 6].map((b) => (
                                        <MenuItem key={b} value={b}>{`${b}類`}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            {schedule?.status === 'wait-examination' ? (
                                <Button
                                    variant="outlined"
                                    startIcon={<Check />}
                                    sx={{ borderRadius: '2rem', height: '2.5rem', marginRight: '1rem' }}
                                    onClick={handleReportSave}
                                >
                                    暫存報告
                                </Button>
                            ) : (
                                <FormControl variant="standard" sx={{ width: '5rem', mr: 2 }}>
                                    <InputLabel id="select-version">版本</InputLabel>
                                    <Select labelId="select-version" value={version} onChange={handleVersionOnChange}>
                                        {report?.records &&
                                            report?.records.map((record, index) => (
                                                <MenuItem key={record.id} value={record.id}>{`v${index + 1}`}</MenuItem>
                                            ))}
                                    </Select>
                                </FormControl>
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
                                variant="outlined"
                                color="red"
                                startIcon={<Close />}
                                sx={{
                                    borderRadius: '2rem',
                                    height: '2.5rem',
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

            <Dialog open={dateDialogOpen} onClose={handleDialogClose}>
                <DialogContent>
                    <DayPicker
                        mode="single"
                        selected={date}
                        onSelect={handleDateSelect}
                        fromYear={1930}
                        toYear={new Date().getFullYear()}
                        captionLayout="dropdown"
                        locale={zhTW}
                        footer={
                            <>
                                <TextField
                                    fullWidth
                                    value={format(date, 'y-MM-dd')}
                                    onChange={handleDateSelect}
                                    sx={{ mt: 2 }}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </>
                        }
                    />
                </DialogContent>
            </Dialog>
        </Grid>
    )
}

export default CreateReport
