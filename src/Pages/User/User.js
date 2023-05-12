import React, { useMemo } from 'react'
import { Box, Button, FormControl, IconButton, InputLabel, MenuItem, Select, Stack } from '@mui/material'
import { AssignmentTurnedIn, Delete, Edit } from '@mui/icons-material'

import { useDispatch, useSelector } from 'react-redux'

import useStyles from './Style'
import CustomTable from '../../Components/CustomTable/CustomTable'
import ReportDialog from '../../Components/ReportDialog/ReportDialog'
import GlobalFilter from './../../Components/GlobalFilter/GlobalFilter'
import { deleteUser, fetchUser, updateUser } from '../../Redux/Slices/User'
import useAlert from '../../Hooks/useAlert'
import Avatar, { genConfig } from 'react-nice-avatar'

const Report = () => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const showAlert = useAlert()

    const { results, count, page, loading } = useSelector((state) => state.user)

    const fetchData = async (params) => {
        dispatch(fetchUser(params))
    }

    const handleDeleteUser = (userID) =>
        showAlert({
            alertTitle: '確定刪除該用戶?',
            toastTitle: '刪除成功',
            icon: 'success',
            type: 'confirm',
            event: () => dispatch(deleteUser(userID)),
        })

    const columns = useMemo(
        () => [
            {
                accessor: 'username',
                Header: '用戶名',
                Cell: (row) => {
                    const config = genConfig(row.row.original.username)
                    return (
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar
                                style={{
                                    width: '2.5rem',
                                    height: '2.5rem',
                                }}
                                {...config}
                            ></Avatar>
                            <Box>{row.row.original.username}</Box>
                        </Stack>
                    )
                },
            },
            { accessor: 'name', Header: '姓名', Cell: (row) => row.row.original.name },
            {
                accessor: 'actions',
                Header: '操作',
                Cell: (row) => (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Button
                            sx={{ color: 'red.main' }}
                            startIcon={<Delete />}
                            onClick={() => handleDeleteUser(row.row.original._id)}
                        >
                            刪除
                        </Button>
                    </Box>
                ),
            },
            {
                accessor: 'createdAt',
                Header: '註冊時間',
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
                    const handleChange = (e) => {
                        dispatch(updateUser({ id: row.row.original._id, data: { role: e.target.value } }))
                        showAlert({ toastTitle: '修改完成', text: `${row.row.original.name}`, icon: 'success' })
                    }
                    return (
                        <Select variant="standard" fullWidth value={row.row.original.role} onChange={handleChange}>
                            <MenuItem value={0}>等待審核</MenuItem>
                            <MenuItem value={1}>行政及護理師</MenuItem>
                            <MenuItem value={2}>醫師</MenuItem>
                            <MenuItem value={3}>管理員</MenuItem>
                            <MenuItem value={4}>放射師</MenuItem>
                        </Select>
                    )
                },
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
