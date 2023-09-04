import React, { useEffect, useMemo, useState } from 'react'
import { Box, Button, FormControl, IconButton, InputLabel, MenuItem, Select, Stack } from '@mui/material'
import { AssignmentTurnedIn, Delete, Edit } from '@mui/icons-material'

import { useDispatch, useSelector } from 'react-redux'

import useStyles from './Style'
import CustomTable from '../../Components/CustomTable/CustomTable'
import GlobalFilter from './../../Components/GlobalFilter/GlobalFilter'
import { deleteUser, fetchUser, updateUser, userTrigger } from '../../Redux/Slices/User'
import useAlert from '../../Hooks/useAlert'
import Avatar, { genConfig } from 'react-nice-avatar'
import { fetchRole } from '../../Redux/Slices/Role'

const User = () => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const showAlert = useAlert()

    const { results, count, page, loading } = useSelector((state) => state.user)
    const { results: roleList } = useSelector((state) => state.role)

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
            { accessor: 'name', Header: '姓名', Cell: (row) => row.row.original.firstName },
            {
                accessor: 'actions',
                Header: '操作',
                Cell: (row) => (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Button
                            sx={{ color: 'red.main' }}
                            startIcon={<Delete />}
                            onClick={() => handleDeleteUser(row.row.original.id)}
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
                        <Box>{new Date(row.row.original.createdTimestamp).toLocaleDateString()}</Box>
                        <Box sx={{ fontSize: '.8rem', color: 'gray.main' }}>
                            {new Date(row.row.original.createdTimestamp).toLocaleTimeString()}
                        </Box>
                    </Box>
                ),
            },
            {
                accessor: 'status',
                Header: '狀態',
                Cell: (row) => {
                    const currentRole = row.row.original.roles.find((role) => !role.composite)

                    const handleChange = (e) => {
                        const updateRole = roleList.find((rl) => rl.id === e.target.value)
                        dispatch(
                            updateUser({
                                userId: row.row.original.id,
                                data: {
                                    currentRole: currentRole,
                                    updateRole: updateRole,
                                },
                            })
                        )
                        showAlert({ toastTitle: '修改完成', text: `${row.row.original.firstName}`, icon: 'success' })
                        dispatch(userTrigger())
                    }
                    return (
                        <Select variant="standard" fullWidth value={currentRole.id} onChange={handleChange}>
                            {roleList.map(({ id, name }) => (
                                <MenuItem key={id} value={id}>
                                    {name}
                                </MenuItem>
                            ))}
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
        </Box>
    )
}

export default User
