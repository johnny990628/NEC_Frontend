import React, { useState, useEffect, useMemo } from 'react'
import { useTable } from 'react-table'
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material'

import CustomTable from '../CustomTable/CustomTable'
import useStyles from './Style'

const CustomModal = ({ columns, data }) => {
    const classes = useStyles()
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
        columns,
        data,
    })

    return (
        <TableContainer>
            <Table {...getTableProps()}>
                <TableHead>
                    {headerGroups.map((headerGroup) => (
                        <TableRow {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                <TableCell {...column.getHeaderProps()}>{column.render('Header')}</TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableHead>
                <TableBody {...getTableBodyProps()}>
                    {rows.map((row) => {
                        prepareRow(row)
                        return (
                            <TableRow {...row.getRowProps()}>
                                {row.cells.map((cell) => (
                                    <TableCell {...cell.getCellProps()}>{cell.render('Cell')}</TableCell>
                                ))}
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default CustomModal
