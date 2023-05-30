import React, { useCallback, useMemo } from 'react'
import { Badge, Box, Button, Stack, Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material'
import {
    CalendarToday,
    Delete,
    Edit,
    Cancel,
    AccessTime,
    Check,
    ClearOutlined,
    ArrowDropDown,
    PersonAddAlt1,
} from '@mui/icons-material'
import Avatar, { genConfig } from 'react-nice-avatar'
import CustomForm from '../../Components/CustomForm/CustomForm'
import useStyles from './Style'
import CustomTable from '../../Components/CustomTable/CustomTable'
import EditDialog from './EditDialog'
import GlobalFilter from '../../Components/GlobalFilter/GlobalFilter'

import { useDispatch, useSelector } from 'react-redux'
import { useTheme } from '@mui/styles'
import { deletePatient, createPatient, fetchPatients } from '../../Redux/Slices/Patient'
import { openDialog } from '../../Redux/Slices/Dialog'
import { addSchedule, removeSchedule } from '../../Redux/Slices/Schedule'
import { changeScheduleStatus } from './../../Redux/Slices/Schedule'
import PROCEDURECODE from '../../Assets/Json/ProcedureCode.json'
import useAlert from './../../Hooks/useAlert'

const Patient = () => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const showAlert = useAlert()
    const theme = useTheme()

    const { data, count, page, loading } = useSelector((state) => state.patients)

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

    const columns = useMemo(
        () => [
            {
                accessor: 'name',
                Header: '姓名',
                Cell: (row) => {
                    const config = genConfig(row.row.original.id)
                    return (
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar
                                style={{
                                    width: '2.5rem',
                                    height: '2.5rem',
                                }}
                                {...config}
                            ></Avatar>
                            <Box sx={{ fontSize: '1.3rem' }}>{row.row.original.name}</Box>
                        </Stack>
                    )
                },
            },
            { accessor: 'id', Header: '身分證字號' },
            { accessor: 'gender', Header: '性別', Cell: (row) => (row.row.original.gender === 'm' ? '男' : '女') },

            {
                accessor: 'action',
                Header: '操作',
                Cell: (row) => {
                    const { name, gender, id } = row.row.original
                    return (
                        <Box>
                            <Button
                                startIcon={<Edit color="primary" />}
                                sx={{ fontSize: '1.1rem' }}
                                onClick={() => {
                                    dispatch(openDialog({ row: row.row.original, type: 'patient' }))
                                }}
                            >
                                編輯
                            </Button>
                            <Button
                                startIcon={<Delete />}
                                sx={{ color: 'red.main', fontSize: '1.1rem' }}
                                onClick={() => {
                                    showAlert({
                                        alertTitle: '確定刪除該病患?將會刪除所有相關資料',
                                        toastTitle: '刪除成功',
                                        text: `${name} ${gender === 'm' ? '先生' : '小姐'}`,
                                        icon: 'success',
                                        type: 'confirm',
                                        event: () => dispatch(deletePatient({ patientID: id })),
                                    })
                                }}
                            >
                                刪除
                            </Button>
                        </Box>
                    )
                },
            },
            {
                accessor: 'createdAt',
                Header: '建立日期',
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
                accessor: 'schedule',
                Header: '排程狀態',
                Cell: (row) => {
                    // const hasReport = row.row.original.report.length > 0
                    const { id, name, gender } = row.row.original
                    const mr = gender === 'm' ? '先生' : '小姐'
                    const on_call = row.row.original?.schedule?.find(({ status }) => status === 'on-call')
                    const wait_examination = row.row.original?.schedule?.find(
                        ({ status }) => status === 'wait-examination'
                    )
                    const wait_finish = row.row.original?.schedule?.find(({ status }) => status === 'wait-finish')

                    const scheduleStatus = () => {
                        if (on_call) return { status: 'on-call', class: 'call', text: '檢查中', icon: <AccessTime /> }
                        if (wait_examination)
                            return {
                                status: 'wait-examination',
                                class: 'examination',
                                text: '等待檢查',
                                icon: <ClearOutlined />,
                            }
                        if (wait_finish)
                            return {
                                status: 'wait-finish',
                                class: 'call',
                                text: '暫存報告',
                                icon: <AccessTime />,
                            }
                        return { status: 'yet', class: 'yet', text: '等待排程', icon: <CalendarToday /> }
                    }
                    const status = scheduleStatus()

                    return (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Button
                                className={`${classes.status} ${status.class} `}
                                startIcon={status.icon}
                                fullWidth
                                onClick={() => {
                                    switch (status.status) {
                                        case 'wait-examination':
                                            showAlert({
                                                alertTitle: `確定要取消 ${name} ${mr}的排程?`,
                                                toastTitle: '取消排程',
                                                text: `${name} ${mr}`,
                                                type: 'confirm',
                                                event: () => dispatch(removeSchedule(wait_examination._id)),
                                            })

                                            break
                                        case 'yet':
                                            showAlert({
                                                alertTitle: `請輸入${name}的醫令`,
                                                toastTitle: '加入排程',
                                                text: `${name} ${mr}`,
                                                type: 'select',
                                                options: PROCEDURECODE,
                                                event: (text) => {
                                                    dispatch(
                                                        addSchedule({
                                                            patientID: id,
                                                            procedureCode: text,
                                                        })
                                                    )
                                                },
                                            })
                                            break
                                        case 'on-call':
                                            showAlert({
                                                alertTitle: `確定要取消 ${name} ${mr}的檢查狀態(非管理員請勿操作)`,
                                                toastTitle: '取消檢查狀態',
                                                text: `${name} ${mr}`,
                                                type: 'confirm',
                                                event: () => {
                                                    const onCall = row.row.original?.schedule?.find(
                                                        ({ status }) => status === 'on-call'
                                                    )
                                                    dispatch(
                                                        changeScheduleStatus({
                                                            scheduleID: onCall._id,
                                                            status: 'wait-examination',
                                                        })
                                                    )
                                                },
                                            })

                                            break
                                        default:
                                            break
                                    }
                                }}
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

    const fetchData = useCallback((params) => dispatch(fetchPatients(params)), [])

    const sendData = useCallback((data) => dispatch(createPatient(data)), [])

    return (
        <Box className={classes.container}>
            <Accordion elevation={0} className={classes.accordion}>
                {/* expandIcon={ <ArrowDropDown />}  */}
                <AccordionSummary style={{ width: '10%' }}>
                    <Typography sx={{ flexShrink: 0 }}>
                        <Button startIcon={<PersonAddAlt1 color="primary" />} sx={{ fontSize: '1rem' }}>
                            新增病患
                        </Button>
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <CustomForm title="新增病人" sendData={sendData} mode="create" />
                </AccordionDetails>
            </Accordion>

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
