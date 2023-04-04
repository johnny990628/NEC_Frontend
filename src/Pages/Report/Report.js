import React, { useEffect, useMemo } from 'react'
import { Box, Button, IconButton } from '@mui/material'
import { Delete, FeedOutlined, Visibility } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'

import useStyles from './Style'

import CustomTable from '../../Components/CustomTable/CustomTable'
import ReportDialog from '../../Components/ReportDialog/ReportDialog'
import GlobalFilter from './../../Components/GlobalFilter/GlobalFilter'
import { fetchReportByReportID } from '../../Redux/Slices/Dialog'
import { deleteReport, fetchReport, reportTrigger } from '../../Redux/Slices/Report'
import Authorized from './../../Components/Authorized/Authorized'
import useAlert from '../../Hooks/useAlert'

const Report = () => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const showAlert = useAlert()

    const { results, count, page, loading } = useSelector((state) => state.report)
    const { user } = useSelector((state) => state.auth)
    const { isOpen } = useSelector((state) => state.dialog.report)

    useEffect(() => {
        isOpen || dispatch(reportTrigger())
    }, [isOpen])

    const fetchData = async (params) => {
        dispatch(fetchReport(params))
    }

    const handlePreviewReport = (reportID) => dispatch(fetchReportByReportID(reportID))

    const handleDeleteReport = (reportID) =>
        showAlert({
            alertTitle: '確定刪除該報告?',
            toastTitle: '刪除成功',
            icon: 'success',
            type: 'confirm',
            event: () => dispatch(deleteReport(reportID)),
        })

    const columns = useMemo(
        () => [
            {
                accessor: 'status',
                Header: '狀態',
                Cell: (row) => {
                    return (
                        <Box
                            className={`${classes.status} ${
                                row.row.original?.schedule?.status === 'wait-examination' && 'processing'
                            }`}
                        >
                            {row.row.original?.schedule?.status === 'wait-examination' ? (
                                <Box className={classes.statusBox}>未完成</Box>
                            ) : (
                                <Box className={classes.statusBox}>已完成</Box>
                            )}
                        </Box>
                    )
                },
            },
            { accessor: 'procedureCode', Header: '醫令代碼', Cell: (row) => row.row.original.schedule.procedureCode },
            {
                accessor: 'patientID',
                Header: '身分證字號',
                Cell: (row) => (row.row.original.patient ? row.row.original.patient.id : row.row.original.patientID),
            },
            {
                accessor: 'name',
                Header: '姓名',
                Cell: (row) => (row.row.original.patient ? row.row.original.patient.name : '無病人資料'),
            },
            { accessor: 'version', Header: '報告版本', Cell: (row) => row.row.original.records.length || '無' },

            // { accessor: 'blood', Header: '抽血編號', Cell: (row) => row.row.original.blood },
            {
                accessor: 'user',
                Header: '完成者',
                Cell: (row) => (row.row.original?.user ? row.row.original.user.name : row.row.original.userID || '無'),
            },
            {
                accessor: 'createdAt',
                Header: '完成時間',
                Cell: (row) => new Date(row.row.original.createdAt).toLocaleString(),
            },
            {
                accessor: 'actions',
                Header: '操作',
                Cell: (row) => (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {row.row.original?.schedule?.status === 'finish' && (
                            <>
                                <Button
                                    color="primary"
                                    startIcon={<FeedOutlined />}
                                    onClick={() => handlePreviewReport(row.row.original._id)}
                                >
                                    查看報告
                                </Button>

                                <Authorized currentRole={user.role} authority={[3, 2]} noMatch={<></>}>
                                    <Button
                                        sx={{ color: 'red.primary' }}
                                        startIcon={<Delete />}
                                        onClick={() => handleDeleteReport(row.row.original._id)}
                                    >
                                        刪除
                                    </Button>
                                </Authorized>
                            </>
                        )}
                    </Box>
                ),
            },
        ],
        []
    )

    return (
        <Box className={classes.container}>
            <CustomTable
                columns={columns}
                fetchData={fetchData}
                data={results}
                loading={loading}
                totalPage={page}
                totalCount={count}
                GlobalFilter={GlobalFilter}
            />
            <ReportDialog mode="edit" />
        </Box>
    )
}

export default Report
