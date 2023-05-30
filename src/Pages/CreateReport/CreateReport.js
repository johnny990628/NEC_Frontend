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
    ToggleButton,
    ToggleButtonGroup,
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
    Cast,
    CastConnected,
    Filter,
    PostAdd,
    Summarize,
    SummarizeOutlined,
    LocalPrintshop,
} from '@mui/icons-material'
import { useTheme } from '@mui/styles'
import { zhTW } from 'date-fns/locale'
import {
    addDays,
    eachDayOfInterval,
    endOfWeek,
    format,
    getDate,
    getISOWeek,
    isSameDay,
    parseISO,
    startOfWeek,
} from 'date-fns'

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

import { fetchSchedule, removeSchedule, setupDate } from '../../Redux/Slices/Schedule'

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
    const [week, setWeek] = useState([])
    const [searchText, setSearchText] = useState('')
    const [search, setSearch] = useState('')
    const [dateDialogOpen, setDateDialogOpen] = useState(false)
    const [toggleMode, setToggleMode] = useState('report')
    const [iframeURL, setIframeURL] = useState('')

    const { schedules, loading, count } = useSelector((state) => state.schedule)
    const { user } = useSelector((state) => state.auth)
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
        setIframeURL(`${process.env.REACT_APP_BLUELIGHT_URL}?StudyInstanceUID=${currentSchedule?.StudyInstanceUID}`)

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
            if (currentRecord) {
                dispatch(setupReport(currentRecord.report))
                // dispatch(setupBirads(currentRecord.birads))
                for (const item of ['L', 'R']) {
                    dispatch(setupBirads({ side: [item], value: currentRecord.birads[item] }))
                }
            }
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

        const startOfWeekDate = startOfWeek(date)
        const endOfWeekDate = endOfWeek(date)
        const weekArray = eachDayOfInterval({
            start: startOfWeekDate,
            end: endOfWeekDate,
        })
        setWeek(weekArray)

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
                event: () => dispatch(removeSchedule(schedule._id)),
            })
        }
        if (schedule.status === 'wait-finish' || schedule.status === 'finish') {
            showAlert({
                alertTitle: '確定刪除該報告?',
                toastTitle: '刪除成功',
                icon: 'success',
                type: 'confirm',
                event: () => dispatch(removeSchedule(schedule._id)),
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
    const weekList = useMemo(() => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], [])

    return (
        <Grid container spacing={2}>
            <Grid container item xs={3} sx={{ pt: 0 }}>
                <Grid item xs={12} mb={2}>
                    <Box display="flex" justifyContent="space-between" className={classes.listContainer}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Search sx={{ color: 'gray.main', mr: 0.5 }} />
                            <TextField
                                variant="standard"
                                sx={{ width: '100%' }}
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
                                    sx={{ color: 'gray.main', cursor: 'pointer' }}
                                    onClick={() => setDateDialogOpen(true)}
                                >
                                    <Box sx={{ fontSize: '1.3rem' }}>{`${
                                        new Date(date).toLocaleDateString().split('/')[1]
                                    }/${new Date(date).toLocaleDateString().split('/')[2]}`}</Box>

                                    {/* <Box sx={{ fontSize: '0.9rem' }}>
                                    {new Date(date).toLocaleDateString().split('/')[0]}
                                </Box> */}
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
                </Grid>
                <Grid item xs={12} className={classes.listContainer}>
                    <Stack direction="row" justifyContent="center" spacing={0.5}>
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
                </Grid>
            </Grid>
            <Grid container item xs={9}>
                <Grid item xs={12} mb={2}>
                    <Box className={classes.listContainer} sx={{ display: 'flex', justifyContent: 'space-around' }}>
                        <IconButton sx={{ color: 'gray.main' }} onClick={() => setDate((date) => addDays(date, -7))}>
                            <ArrowLeft />
                        </IconButton>
                        {week.map((w, index) => {
                            const theDate = new Date(w)
                            const day = getDate(theDate)
                            const isSame = isSameDay(theDate, date)

                            return (
                                <Box
                                    key={day}
                                    sx={{
                                        mr: 2,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        width: '1.8rem',
                                        borderBottom: isSame && `2px solid ${theme.palette.primary.main}`,
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => setDate(theDate)}
                                >
                                    <Box sx={{ fontSize: '.8rem', color: 'gray.main' }}> {weekList[index]}</Box>
                                    <Box
                                        sx={{
                                            fontSize: '1.2rem',
                                            color: isSame && theme.palette.primary.main,
                                        }}
                                    >
                                        {day}
                                    </Box>
                                </Box>
                            )
                        })}
                        <IconButton sx={{ color: 'gray.main' }} onClick={() => setDate((date) => addDays(date, 7))}>
                            <ArrowRight />
                        </IconButton>
                    </Box>
                </Grid>
                <Grid item xs={12} sx={{ height: '60%' }}>
                    <List
                        className={classes.listContainer}
                        sx={{ height: '100%', display: 'flex', flexDirection: 'row', overflowX: 'auto' }}
                    >
                        {scheduleList &&
                            scheduleList.map((schedule) => {
                                const { id: patientID, name } = schedule.patient
                                const { _id: scheduleID, procedureCode, updatedAt, status } = schedule
                                const config = genConfig(patientID)
                                return (
                                    <Box
                                        key={scheduleID}
                                        sx={{
                                            borderLeft: `4px solid ${theme.palette[badgeColor(status)].main}`,
                                            width: '22%',
                                        }}
                                    >
                                        <ListItemButton
                                            selected={selection === scheduleID}
                                            onClick={() => handleSelectionClick(scheduleID)}
                                            sx={{
                                                width: '100%',
                                                height: '100%',
                                            }}
                                        >
                                            <Box display="flex" justifyContent="flex-start" alignItems="center">
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
                                                            <Box display="flex">
                                                                <Box>{new Date(updatedAt).toLocaleTimeString()}</Box>
                                                                {/* <Box
                                                                className={`${classes.status} ${
                                                                    procedureCode === '19014C' && 'yet'
                                                                }`}
                                                                sx={{ mt: 1 }}
                                                            >
                                                                {procedureCode}
                                                            </Box> */}
                                                            </Box>
                                                        </Stack>
                                                    }
                                                ></ListItemText>
                                            </Box>
                                        </ListItemButton>

                                        {/* <Divider /> */}
                                    </Box>
                                )
                            })}
                    </List>
                </Grid>
            </Grid>
            <Grid item xs={12} className={classes.reportContainer} mt={2}>
                {selection && (
                    <Box sx={{ height: '100%' }}>
                        <Box
                            sx={{
                                width: '100%',
                                height: '5%',
                                display: 'flex',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Box display="flex" alignItems="center">
                                <ToggleButtonGroup
                                    color="primary"
                                    value={toggleMode}
                                    exclusive
                                    onChange={(e, mode) => {
                                        if (mode) {
                                            setToggleMode(mode)
                                            setIframeURL(
                                                `${process.env.REACT_APP_BLUELIGHT_URL}?StudyInstanceUID=${schedule?.StudyInstanceUID}`
                                            )
                                        }
                                    }}
                                >
                                    <ToggleButton value="report">
                                        <SummarizeOutlined />
                                    </ToggleButton>
                                    <ToggleButton value="viewer">
                                        <Filter />
                                    </ToggleButton>
                                </ToggleButtonGroup>
                                {toggleMode === 'viewer' && (
                                    <Button
                                        variant="outlined"
                                        sx={{ ml: 2 }}
                                        onClick={() => window.open(iframeURL, '_blank')}
                                    >
                                        在新分頁開啟
                                    </Button>
                                )}
                            </Box>
                            <Box>
                                {/* <FormControl variant="standard" sx={{ width: '8rem', mr: 2 }}>
                                    <InputLabel id="select-birads">BI-RADS</InputLabel>
                                    <Select
                                        labelId="select-birads"
                                        value={birads}
                                        disabled={user.role === 4}
                                        onChange={handleBiradsChange}
                                    >
                                        {[1, 2, 3, 4, 5, 6].map((b) => (
                                            <MenuItem key={b} value={b}>{`${b}類`}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl> */}
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
                                        <Select
                                            labelId="select-version"
                                            value={version}
                                            onChange={handleVersionOnChange}
                                        >
                                            {report?.records &&
                                                report?.records.map((record, index) => (
                                                    <MenuItem key={record.id} value={record.id}>{`v${
                                                        index + 1
                                                    }`}</MenuItem>
                                                ))}
                                        </Select>
                                    </FormControl>
                                )}

                                <Button
                                    variant="contained"
                                    startIcon={<Check />}
                                    sx={{ borderRadius: '2rem', height: '2.5rem', marginRight: '1rem' }}
                                    onClick={handleReportSubmit}
                                    disabled={user.role === 4}
                                >
                                    完成報告
                                </Button>

                                <Button
                                    variant="outlined"
                                    color="red"
                                    startIcon={<Close />}
                                    sx={{ borderRadius: '2rem', height: '2.5rem', marginRight: '1rem' }}
                                    onClick={deleteReportAndSchedule}
                                >
                                    刪除報告
                                </Button>
                                {schedule?.status === 'finish' && (
                                    <Button
                                        variant="contained"
                                        color="green"
                                        startIcon={<LocalPrintshop />}
                                        sx={{
                                            borderRadius: '2rem',
                                            height: '2.5rem',
                                        }}
                                        onClick={() => {
                                            showAlert({
                                                icon: 'success',
                                                type: 'exportReport',
                                            })
                                        }}
                                    >
                                        列印報告
                                    </Button>
                                )}
                            </Box>
                        </Box>
                        {toggleMode === 'report' && (
                            <Box sx={{ height: '100%' }}>
                                <CustomReportForm
                                    cols1={REPORTCOLS}
                                    cols2={REPORTCOLS2}
                                    schedule={schedule}
                                    mode="create"
                                />
                            </Box>
                        )}

                        <Box
                            sx={{
                                height: '90%',
                                width: '100%',
                                mt: 3,
                                display: toggleMode === 'viewer' ? 'block' : 'none',
                            }}
                        >
                            <iframe src={iframeURL} style={{ height: '100%', width: '100%' }} />
                        </Box>
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
