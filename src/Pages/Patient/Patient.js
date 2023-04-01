import React, { useCallback, useMemo } from 'react'
import { Box, IconButton, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material'
import { CalendarToday, Delete, Edit, Cancel, AccessTime, Check } from '@mui/icons-material'

import useStyles from './Style'
import CustomTable from '../../Components/CustomTable/CustomTable'
import EditDialog from './EditDialog'
import GlobalFilter from '../../Components/GlobalFilter/GlobalFilter'

import { useDispatch, useSelector } from 'react-redux'
import { deletePatient, createPatient, fetchPatients } from '../../Redux/Slices/Patient'
import { openDialog } from '../../Redux/Slices/Dialog'
import { openAlert } from '../../Redux/Slices/Alert'
import { addSchedule, removeSchedule } from '../../Redux/Slices/Schedule'
import { changeScheduleStatus } from './../../Redux/Slices/Schedule'

import PROCEDURECODE from '../../Assets/Json/ProcedureCode.json'

const Patient = () => {
    const classes = useStyles()
    const dispatch = useDispatch()

    const { data, count, page, loading } = useSelector((state) => state.patients)

    const columns = useMemo(
        () => [
            {
                accessor: 'schedule',
                Header: '排程狀態',
                Cell: (row) => {
                    // const hasReport = row.row.original.report.length > 0
                    const { id, name, gender } = row.row.original
                    const mr = gender === 'm' ? '先生' : '小姐'

                    const scheduleStatus = () => {
                        const onCall = row.row.original?.schedule?.find(({ status }) => status === 'on-call')
                        const wait = row.row.original?.schedule?.find(({ status }) => status === 'wait-examination')
                        if (onCall) return { status: 'on-call', class: 'call', text: '檢查中' }
                        if (wait) return { status: 'wait-examination', class: 'examination', text: '等待檢查' }
                        return { status: 'yet', class: 'yet', text: '等待排程' }
                    }
                    const status = scheduleStatus()

                    return (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {status.status === 'wait-examination' && (
                                <IconButton
                                    onClick={() => {
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
                            )}
                            {status.status === 'yet' && (
                                <IconButton
                                    onClick={() => {
                                        dispatch(
                                            openAlert({
                                                alertTitle: `請輸入${name}的醫令`,
                                                toastTitle: '加入排程',
                                                text: `${name} ${mr}`,
                                                type: 'select',
                                                options: PROCEDURECODE,
                                                event: (text) =>
                                                    dispatch(
                                                        addSchedule({
                                                            patientID: id,
                                                            procedureCode: text,
                                                        })
                                                    ),
                                            })
                                        )
                                    }}
                                >
                                    <CalendarToday />
                                </IconButton>
                            )}
                            {status.status === 'on-call' && (
                                <IconButton
                                    onClick={() =>
                                        dispatch(
                                            openAlert({
                                                alertTitle: `確定要取消 ${name} ${mr}的檢查狀態(非管理員請勿操作)`,
                                                toastTitle: '取消檢查狀態',
                                                text: `${name} ${mr}`,
                                                type: 'confirm',
                                                event: () => {
                                                    const onCall = row.row.original?.schedule?.find(
                                                        ({ status }) => status === 'on-call'
                                                    )
                                                    console.log(onCall)
                                                    dispatch(
                                                        changeScheduleStatus({
                                                            scheduleID: onCall._id,
                                                            status: 'wait-examination',
                                                        })
                                                    )
                                                },
                                            })
                                        )
                                    }
                                >
                                    <AccessTime />
                                </IconButton>
                            )}
                            {status.status === 'finish' && (
                                <IconButton>
                                    <Check />
                                </IconButton>
                            )}
                            <Box className={`${classes.status} ${status.class} `}>
                                <Box className={classes.statusBox}>{status.text}</Box>
                            </Box>
                        </Box>
                    )
                },
            },

            { accessor: 'id', Header: '身分證字號' },
            { accessor: 'name', Header: '姓名' },
            { accessor: 'gender', Header: '性別', Cell: (row) => (row.row.original.gender === 'm' ? '男' : '女') },
            // {
            //     accessor: 'department',
            //     Header: '部門',
            //     Cell: (row) =>
            //         row.row.original.department.length > 6
            //             ? row.row.original.department.slice(0, 6) + '...'
            //             : row.row.original.department,
            // },
            {
                accessor: 'createdAt',
                Header: '建立日期',
                Cell: (row) => new Date(row.row.original.createdAt).toLocaleString(),
            },
            {
                accessor: 'action',
                Header: '操作',
                Cell: (row) => {
                    const { name, gender, id } = row.row.original
                    return (
                        <Box>
                            <IconButton
                                onClick={() => {
                                    dispatch(openDialog({ row: row.row.original, type: 'patient' }))
                                }}
                            >
                                <Edit />
                            </IconButton>
                            <IconButton
                                onClick={() => {
                                    dispatch(
                                        openAlert({
                                            alertTitle: '確定刪除該病患?將會刪除所有相關資料',
                                            toastTitle: '刪除成功',
                                            text: `${name} ${gender === 'm' ? '先生' : '小姐'}`,
                                            icon: 'success',
                                            type: 'confirm',
                                            event: () => dispatch(deletePatient({ patientID: id })),
                                        })
                                    )
                                }}
                            >
                                <Delete />
                            </IconButton>
                        </Box>
                    )
                },
            },
        ],
        []
    )

    const fetchData = useCallback((params) => dispatch(fetchPatients(params)), [])

    const sendData = useCallback((data) => dispatch(createPatient(data)), [])

    return (
        <Box className={classes.container}>
            {/* <Accordion elevation={0} className={classes.accordion}>
                <AccordionSummary expandIcon={<ArrowDropDown />} sx={{ flexDirection: 'column-reverse' }} />
                <AccordionDetails>
                    <CustomForm title="新增病人" sendData={sendData} mode="create" />
                </AccordionDetails>
            </Accordion> */}

            <CustomTable
                columns={columns}
                fetchData={fetchData}
                data={data}
                loading={loading}
                totalPage={page}
                totalCount={count}
                GlobalFilter={GlobalFilter}
            />
            <EditDialog />
        </Box>
    )
}

export default Patient
