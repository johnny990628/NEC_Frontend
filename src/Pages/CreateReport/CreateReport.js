import React, { useEffect, useRef, useState } from 'react'
import { Box, Stepper, Step, StepLabel, IconButton, Button } from '@mui/material'
import { ArrowBack, ArrowForward, CheckCircleOutline, Cancel, Check, Close } from '@mui/icons-material'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import { useTheme } from '@mui/styles'
import useStyles from './Style'

import { useDispatch, useSelector } from 'react-redux'
import { v4 } from 'uuid'
import Lottie from 'lottie-react'

import CustomDataGrid from '../../Components/CustomDataGrid/CustomDataGrid'
import CustomReportForm from '../../Components/CustomReport/CustomReportForm'
import REPORTCOLS from '../../Assets/Json/ReportCols.json'
import REPORTCOLS2 from '../../Assets/Json/ReportCols2.json'

import { createReport, resetReport } from '../../Redux/Slices/ReportForm'
import ReportDialog from '../../Components/ReportDialog/ReportDialog'
import { fetchReportByReportID } from '../../Redux/Slices/Dialog'
import { openAlert } from '../../Redux/Slices/Alert'
import { fetchSchedule, removeSchedule } from '../../Redux/Slices/Schedule'
import success from '../../Assets/Animation/success.json'
import { apiAddWorklist } from '../../Axios/WorkList'
import { changeScheduleStatus } from './../../Redux/Slices/Schedule'

const CreateReport = () => {
    const [currentStep, setCurrentStep] = useState(0)
    const [selection, setSelection] = useState([])
    const [selectTrigger, setSelectTrigger] = useState(false)
    const [patient, setPatient] = useState({})
    const [scheduleID, setScheduleID] = useState('')
    const [reportDialogMode, setReportDialogMode] = useState('create')

    const { schedules, patients, count } = useSelector((state) => state.schedule)
    const { user } = useSelector((state) => state.auth)
    const report = useSelector((state) => state.reportForm.create)

    const dispatch = useDispatch()
    const classes = useStyles()
    const theme = useTheme()
    const scheduleIDRef = useRef(scheduleID)

    useEffect(() => {
        if (selection.length > 0) {
            const { _id, patient, reportID, reports } = schedules.find((s) => s.patientID === selection[0])
            setPatient({ ...patient, reportID, reports })
            setScheduleID(_id)
            if (!selectTrigger) {
                setCurrentStep(1)
                dispatch(changeScheduleStatus({ scheduleID: _id, status: 'on-call' }))
            }
            setSelectTrigger(false)
        }
    }, [selection])

    useEffect(() => {
        if (currentStep === 0) {
            setReportDialogMode('create')
            if (scheduleID) dispatch(changeScheduleStatus({ scheduleID, status: 'wait-examination' }))
            dispatch(fetchSchedule())
            dispatch(resetReport({ mode: 'create' }))
        }
        if (currentStep === 2) {
            setReportDialogMode('edit')
            handleReportSubmit()
            if (scheduleID) {
                dispatch(changeScheduleStatus({ scheduleID, status: 'finish' }))
                setScheduleID('')
            }
        }
    }, [currentStep])

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            e.preventDefault()
            dispatch(resetReport({ mode: 'create' }))
            if (scheduleIDRef.current)
                dispatch(changeScheduleStatus({ scheduleID: scheduleIDRef.current, status: 'wait-examination' }))
            return ''
        }

        window.addEventListener('beforeunload', handleBeforeUnload)
        return () => {
            dispatch(resetReport({ mode: 'create' }))
            if (scheduleIDRef.current)
                dispatch(changeScheduleStatus({ scheduleID: scheduleIDRef.current, status: 'wait-examination' }))
            window.removeEventListener('beforeunload', handleBeforeUnload)
        }
    }, [])

    useEffect(() => {
        scheduleIDRef.current = scheduleID
    }, [scheduleID])

    const handleReportSubmit = () => {
        dispatch(
            createReport({
                patientID: patient.id,
                reportID: patient.reportID,
                scheduleID,
                data: { report: { report, id: v4() }, userID: user._id, status: 'finished' },
            })
        )
    }

    const columns = [
        {
            field: 'processing',
            headerName: '取消排程',
            renderCell: (params) => {
                return (
                    <IconButton
                        onClick={() => {
                            const { id, name, gender } = params.row
                            setSelectTrigger(true)
                            const mr = gender === 'm' ? '先生' : '小姐'
                            dispatch(
                                openAlert({
                                    alertTitle: `確定要取消 ${name} ${mr}的排程?`,
                                    toastTitle: '取消排程',
                                    text: `${name} ${mr}`,
                                    type: 'confirm',
                                    event: () => dispatch(removeSchedule(id)),
                                })
                            )
                        }}
                    >
                        <Cancel />
                    </IconButton>
                )
            },
        },
        {
            field: 'workList',
            headerName: '超音波開單',
            renderCell: (params) => {
                return (
                    <IconButton
                        onClick={() => {
                            apiAddWorklist(params.row.id)
                                .then((res) =>
                                    dispatch(
                                        openAlert({
                                            toastTitle: '開單成功',
                                            text: `新增workList ${res.data.name}`,
                                            icon: 'success',
                                        })
                                    )
                                )
                                .catch((err) =>
                                    dispatch(
                                        openAlert({
                                            toastTitle: '開單失敗',
                                            text: err.response.data.message,
                                            icon: 'error',
                                        })
                                    )
                                )
                            setSelectTrigger(true)
                        }}
                    >
                        <PhotoCameraIcon />
                    </IconButton>
                )
            },
        },
        { field: 'id', headerName: '身分證字號', flex: 2 },
        { field: 'blood', headerName: '抽血編號', flex: 1 },
        { field: 'name', headerName: '姓名', flex: 1 },
        {
            field: 'gender',
            headerName: '性別',
            flex: 1,
            renderCell: (params) => {
                return <div>{params.row.gender === 'm' ? '男' : '女'}</div>
            },
        },
        {
            field: 'birth',
            headerName: '生日',
            flex: 1,
            renderCell: (params) => {
                return <Box>{new Date(params.row.birth).toLocaleDateString()}</Box>
            },
        },
        { field: 'phone', headerName: '電話', flex: 1 },
    ]

    const FinishSection = () => {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                }}
            >
                <Lottie style={{ width: '60vw', height: '50vh' }} animationData={success} loop={true} />

                <Box sx={{ fontSize: '3rem' }}>報告已成功儲存</Box>
                <Box sx={{ fontSize: '2rem' }}>檢查者:{patient.name}</Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                    <Button
                        variant="contained"
                        sx={{
                            background: theme.palette.contrast.main,
                            '&:hover': {
                                backgroundColor: theme.palette.contrast.dark,
                            },
                        }}
                        className={classes.button}
                        onClick={() => dispatch(fetchReportByReportID(patient.reportID))}
                    >
                        預覽
                    </Button>

                    <Button variant="contained" className={classes.button} onClick={() => setCurrentStep(0)}>
                        返回
                    </Button>
                </Box>
            </Box>
        )
    }

    return (
        <Box sx={{ width: '100%', height: '100%' }}>
            <Box className={classes.container}>
                <Box className={classes.tableContainer}>
                    {currentStep === 0 && (
                        <CustomDataGrid
                            data={patients}
                            columns={columns}
                            selection={selection}
                            setSelection={setSelection}
                        />
                    )}
                    {currentStep === 1 && (
                        <Box sx={{ height: '100%' }}>
                            <CustomReportForm cols1={REPORTCOLS} cols2={REPORTCOLS2} patient={patient} mode="create" />
                            <Box sx={{ width: '100%', height: '8%', display: 'flex', justifyContent: 'end' }}>
                                <Button
                                    variant="contained"
                                    startIcon={<Check />}
                                    sx={{ borderRadius: '2rem', height: '2.5rem', marginRight: '1rem' }}
                                    onClick={() => setCurrentStep(2)}
                                >
                                    完成報告
                                </Button>
                                <Button
                                    variant="outlined"
                                    startIcon={<Close />}
                                    sx={{ borderRadius: '2rem', height: '2.5rem' }}
                                    onClick={() => setCurrentStep(0)}
                                >
                                    取消
                                </Button>
                            </Box>
                        </Box>
                    )}
                    {currentStep === 2 && <FinishSection />}
                </Box>
            </Box>
            <ReportDialog mode={reportDialogMode} />
        </Box>
    )
}

export default CreateReport
