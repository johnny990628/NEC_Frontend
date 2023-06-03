import React, { useEffect, useMemo, useState } from 'react'
import { Box, Button, Stack } from '@mui/material'
import {
    AirlineSeatIndividualSuite,
    ArrowBackIos,
    CalendarToday,
    Check,
    CheckBox,
    CheckBoxOutlineBlank,
    Close,
    Delete,
    Visibility,
} from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'

import useStyles from './Style'

import CustomTable from '../../Components/CustomTable/CustomTable'
import ReportDialog from '../../Components/ReportDialog/ReportDialog'
import GlobalFilter from './../../Components/GlobalFilter/GlobalFilter'

import { fetchSchedule, removeSchedule } from '../../Redux/Slices/Schedule'
import useAlert from '../../Hooks/useAlert'
import CustomReportForm from '../../Components/CustomReport/CustomReportForm'
import {
    finishReport,
    updateReport,
    resetReport,
    setupSchedule,
    fetchReportByReportID,
} from '../../Redux/Slices/Breast'

import Avatar, { genConfig } from 'react-nice-avatar'

const Report = () => {
    const classes = useStyles()
    const dispatch = useDispatch()

    const [isExamination, setIsExamination] = useState(false)
    const [selection, setSelection] = useState({})

    const { schedules, count, page, loading } = useSelector((state) => state.schedule)

    const showAlert = useAlert()

    const fetchData = async (params) => {
        dispatch(fetchSchedule(params))
    }

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
        if (schedule.status === 'wait-finish' || schedule.status === 'finish')
            dispatch(fetchReportByReportID({ reportID: schedule.reportID }))

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
                Cell: (row) => row.row.original?.procedureCode,
            },

            {
                accessor: 'actions',
                Header: '操作',
                Cell: (row) => (
                    <Box>
                        <Button
                            startIcon={<Visibility color="contrast" />}
                            sx={{ fontSize: '1.1rem', color: 'contrast.main' }}
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

    return (
        <Box className={classes.container}>
            {isExamination ? (
                <>
                    <Box
                        sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', padding: '.5rem 1rem' }}
                    >
                        <Box>
                            <Button startIcon={<ArrowBackIos />} sx={{}} onClick={() => handleCancelExamination()}>
                                返回
                            </Button>
                        </Box>
                        <Box>
                            {selection?.status === 'wait-examination' && (
                                <Button
                                    variant="outlined"
                                    startIcon={<Check />}
                                    sx={{ borderRadius: '2rem', marginRight: '1rem' }}
                                    onClick={handleReportSave}
                                >
                                    暫存報告
                                </Button>
                            )}
                            <Button
                                variant="contained"
                                startIcon={<Check />}
                                sx={{ borderRadius: '2rem' }}
                                onClick={() => handleReportSubmit()}
                            >
                                完成報告
                            </Button>
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

            <ReportDialog />
        </Box>
    )
}

export default Report
