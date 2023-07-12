import React, { useEffect, useMemo, useState } from 'react'
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Stack,
} from '@mui/material'
import {
    AirlineSeatIndividualSuite,
    ArrowBackIos,
    CalendarToday,
    Check,
    CheckBox,
    CheckBoxOutlineBlank,
    Close,
    Delete,
    Input,
    Visibility,
} from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'

import useStyles from './Style'

import CustomTable from '../../Components/CustomTable/CustomTable'
import GlobalFilter from './../../Components/GlobalFilter/GlobalFilter'

import { fetchSchedule, removeSchedule } from '../../Redux/Slices/Schedule'
import useAlert from '../../Hooks/useAlert'
import CustomReportForm from '../../Components/CustomReport/CustomReportForm'
import {
    updateReport,
    resetReport,
    setupSchedule,
    fetchReportByReportID,
    setupReport,
    finishReport,
} from '../../Redux/Slices/Breast'

import Avatar, { genConfig } from 'react-nice-avatar'
import Circle from '../../Components/CustomReport/Circle'
import ExamForm from '../../Components/CustomReport/ExamForm'
import Preport from './Preport'

const Report = () => {
    const classes = useStyles()
    const dispatch = useDispatch()

    const [isExamination, setIsExamination] = useState(false)
    const [selection, setSelection] = useState({})
    const [version, setVersion] = useState()
    const [ver, setVer] = useState()
    const [info, setInfo] = useState({})
    const [finishDialog, setFinishDialog] = useState(false)
    const [showReport, setShowReport] = useState(false)

    const { schedules, count, page, loading } = useSelector((state) => state.schedule)
    const { report } = useSelector((state) => state.breast)
    const { user } = useSelector((state) => state.auth)

    const showAlert = useAlert()

    const fetchData = async (params) => {
        dispatch(fetchSchedule(params))
    }

    useEffect(() => {
        if (version) {
            const currentReport = selection.report.records.find((r) => r.id === version)
            if (currentReport) {
                const currentRecord = currentReport.report
                dispatch(setupReport(currentRecord))
            }
        }
    }, [version])

    // const handlePreviewReport = (reportID) => dispatch(fetchReportByReportID(reportID))

    const handleDeleteReport = (schedule) =>
        showAlert({
            alertTitle: '確定刪除?將會刪除所有相關資料',
            toastTitle: '刪除成功',
            text: `${schedule.patient.name}`,
            icon: 'success',
            type: 'confirm',
            event: () => dispatch(removeSchedule(schedule._id)),
        })

    const handleExamination = (schedule) => {
        if (schedule.status === 'wait-finish' || schedule.status === 'finish') {
            dispatch(fetchReportByReportID({ reportID: schedule.reportID }))
            setVersion(schedule.report?.records[schedule.report.records.length - 1].id)
        }

        setSelection(schedule)
        setIsExamination(true)
        dispatch(setupSchedule(schedule))
    }

    const handleCancelExamination = () => {
        setSelection({})
        setIsExamination(false)
        dispatch(resetReport())
    }

    const handleReportSave = () => {
        dispatch(updateReport())
        showAlert({ toastTitle: '暫存報告', text: `${selection.patient.name}`, icon: 'success' })
        setSelection({})
        setIsExamination(false)
    }
    const handleReportSubmit = () => {
        dispatch(finishReport())
        showAlert({ toastTitle: '儲存報告', text: `${selection.patient.name}`, icon: 'success' })
        setSelection({})
        setIsExamination(false)
        setFinishDialog(false)
    }
    const deleteReportAndSchedule = () => {
        showAlert({
            alertTitle: '確定刪除該報告?',
            toastTitle: '刪除成功',
            icon: 'success',
            type: 'confirm',
            event: async () => {
                dispatch(removeSchedule(selection._id))
                handleCancelExamination()
            },
        })
    }

    const handleVersionOnChange = (e) => {
        setVersion(e.target.value)
    }

    const columns = useMemo(
        () => [
            {
                accessor: 'name',
                Header: '姓名',
                Cell: (row) => {
                    const config = genConfig(row.row.original.patient.id)
                    return (
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar
                                style={{
                                    width: '2.5rem',
                                    height: '2.5rem',
                                }}
                                {...config}
                            ></Avatar>
                            <Box sx={{ fontSize: '1.3rem' }}>{row.row.original.patient.name}</Box>
                        </Stack>
                    )
                },
            },
            {
                accessor: 'patientID',
                Header: '身分證字號',
                Cell: (row) => (row.row.original.patient ? row.row.original.patient.id : row.row.original.patientID),
            },
            {
                accessor: 'procedureCode',
                Header: '病例代碼',
                Cell: (row) => (
                    <Box
                        className={`${classes.procedureStatus} ${
                            row.row.original?.procedureCode === '19014C' ? 'green' : 'purple'
                        }`}
                    >
                        <Box className={classes.statusBox}>{row.row.original?.procedureCode}</Box>
                    </Box>
                ),
            },

            {
                accessor: 'actions',
                Header: '操作',
                Cell: (row) => (
                    <Box>
                        <Button
                            startIcon={<Visibility color="contrast" />}
                            sx={{ fontSize: '1.1rem', color: 'contrast.main' }}
                            onClick={() => {
                                if (row.row.original.status !== 'wait-examination') {
                                    setShowReport(true)
                                    setInfo(row.row.original)
                                    setVer(
                                        row.row.original.report?.records[row.row.original.report.records.length - 1].id
                                    )
                                }
                            }}
                            // onClick={() => handlePreviewReport(row.row.original.reportID)}
                        >
                            檢視
                        </Button>
                        <Button
                            startIcon={<Delete />}
                            sx={{ color: 'red.main', fontSize: '1.1rem' }}
                            onClick={() => handleDeleteReport(row.row.original)}
                        >
                            刪除
                        </Button>
                    </Box>
                ),
            },
            {
                accessor: 'createdAt',
                Header: '創建時間',
                Cell: (row) => (
                    <Box>
                        <Box>{new Date(row.row.original.createdAt).toLocaleDateString()}</Box>
                        <Box sx={{ fontSize: '.8rem', color: 'gray.main' }}>
                            {new Date(row.row.original.createdAt).toLocaleTimeString()}
                        </Box>
                    </Box>
                ),
            },

            {
                accessor: 'status',
                Header: '狀態',
                Cell: (row) => {
                    const scheduleStatus = () => {
                        switch (row.row.original?.status) {
                            case 'wait-examination':
                                return {
                                    status: 'wait-examination',
                                    class: 'examination',
                                    text: '撰寫報告',
                                    icon: <CheckBoxOutlineBlank />,
                                }
                            case 'wait-finish':
                                return {
                                    status: 'wait-finish',
                                    class: 'waitFinish',
                                    text: '等待完成',
                                    icon: <AirlineSeatIndividualSuite />,
                                }
                            case 'finish':
                                return { status: 'finish', class: 'finish', text: '編輯報告', icon: <CheckBox /> }
                            default:
                                return { status: 'yet', class: 'yet', text: '等待排程', icon: <CalendarToday /> }
                        }
                    }
                    const status = scheduleStatus()
                    return (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Button
                                className={`${classes.status} ${status.class} `}
                                startIcon={status.icon}
                                fullWidth
                                onClick={() => handleExamination(row.row.original)}
                            >
                                <Box className={classes.statusBox}>{status.text}</Box>
                            </Button>
                        </Box>
                    )
                },
            },
        ],
        []
    )

    const avatarConfig = (id) => genConfig(id)

    return (
        <Box className={classes.container}>
            {isExamination ? (
                <>
                    <Box
                        sx={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '.5rem 1rem',
                        }}
                    >
                        <Box display="flex" alignItems="center">
                            <Button startIcon={<ArrowBackIos />} onClick={() => handleCancelExamination()}>
                                返回
                            </Button>
                            <Stack direction="row" alignItems="center" spacing={2} ml={4}>
                                <Avatar
                                    style={{
                                        width: '3rem',
                                        height: '3rem',
                                    }}
                                    {...avatarConfig(selection.patientID)}
                                ></Avatar>
                                <Box>
                                    <Box sx={{ fontSize: '1.3rem' }}>{selection.patient.name}</Box>
                                    <Box sx={{ fontSize: '.8rem', color: 'gray.main' }}>{selection.patientID}</Box>
                                </Box>
                            </Stack>
                            {selection?.status !== 'wait-examination' && (
                                <FormControl size="small" variant="outlined" sx={{ width: '5rem', ml: 4 }}>
                                    <InputLabel id="select-version">報告版本</InputLabel>
                                    <Select
                                        labelId="select-version"
                                        label="報告版本"
                                        value={version}
                                        onChange={handleVersionOnChange}
                                    >
                                        {selection.report?.records &&
                                            selection.report?.records.map((record, index) => (
                                                <MenuItem key={record.id} value={record.id}>{`v${index + 1}`}</MenuItem>
                                            ))}
                                    </Select>
                                </FormControl>
                            )}
                            <Button
                                variant="outlined"
                                sx={{ marginLeft: '1rem' }}
                                onClick={() =>
                                    window.open(
                                        `${process.env.REACT_APP_BLUELIGHT_URL}?StudyInstanceUID=${selection?.StudyInstanceUID}`,
                                        '_blank'
                                    )
                                }
                                endIcon={<Input />}
                            >
                                超音波影像
                            </Button>
                        </Box>
                        <Box>
                            {selection?.status !== 'finish' && (
                                <Button
                                    variant="outlined"
                                    startIcon={<Check />}
                                    sx={{ borderRadius: '2rem' }}
                                    onClick={handleReportSave}
                                >
                                    暫存報告
                                </Button>
                            )}
                            {user.role >= 4 && (
                                <Button
                                    variant="contained"
                                    startIcon={<Check />}
                                    sx={{ borderRadius: '2rem', marginLeft: '1rem' }}
                                    onClick={() => setFinishDialog(true)}
                                >
                                    完成報告
                                </Button>
                            )}

                            <Button
                                variant="outlined"
                                color="red"
                                startIcon={<Close />}
                                sx={{ borderRadius: '2rem', marginLeft: '1rem' }}
                                onClick={deleteReportAndSchedule}
                            >
                                刪除報告
                            </Button>
                        </Box>
                    </Box>
                    <CustomReportForm />
                </>
            ) : (
                <CustomTable
                    columns={columns}
                    fetchData={fetchData}
                    data={schedules}
                    loading={loading}
                    totalPage={page}
                    totalCount={count}
                    GlobalFilter={GlobalFilter}
                />
            )}

            <Dialog open={finishDialog} onClose={() => setFinishDialog(false)} maxWidth="xl">
                <DialogContent>
                    <Grid container>
                        <Grid container item xs={3}>
                            <Grid item xs={12}>
                                <Box sx={{ fontSize: '1.3rem' }}>R</Box>
                                <Circle maxSize={130} pos={report['R']} side={'R'} />
                            </Grid>
                            <Grid item xs={12}>
                                <Box sx={{ fontSize: '1.3rem' }}>L</Box>
                                <Circle maxSize={130} pos={report['L']} side={'L'} />
                            </Grid>
                        </Grid>

                        <Grid item xs={9}>
                            <ExamForm />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" color="primary" onClick={handleReportSubmit}>
                        確認
                    </Button>
                    <Button color="red" onClick={() => setFinishDialog(false)}>
                        取消
                    </Button>
                </DialogActions>
            </Dialog>
            <Preport trigger={showReport} setShowReport={setShowReport} info={info} ver={ver} setVer={setVer} />
        </Box>
    )
}

export default Report
