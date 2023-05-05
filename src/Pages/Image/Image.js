import React, { useMemo, useState } from 'react'
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    FormControlLabel,
    FormGroup,
    IconButton,
    Switch,
    Tooltip,
} from '@mui/material'
import { useDebouncedCallback } from 'use-debounce'
import moment from 'moment'

import useStyles from './Style'

import CustomTable from '../../Components/CustomTable/CustomTable'
import ReportDialog from '../../Components/ReportDialog/ReportDialog'
import GlobalFilter from './../../Components/GlobalFilter/GlobalFilter'
import { ArrowDropDown, ContentCopy } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDicom } from './../../Redux/Slices/Dicom'

const Image = () => {
    const dispatch = useDispatch()
    const classes = useStyles()
    const { results, count, page, loading } = useSelector((state) => state.dicom)

    const fetchData = async (params) => {
        dispatch(fetchDicom(params))
    }

    const columns = useMemo(
        () => [
            {
                accessor: 'image',
                Header: '超音波',
                Cell: (row) => (
                    <img
                        src={row.row.original.imageURL}
                        alt={row.row.original.StudyInstanceUID}
                        width={80}
                        height={100}
                    />
                ),
            },
            {
                accessor: 'StudyInstanceUID',
                Header: '報告ID',
                Cell: (row) => {
                    return (
                        <Tooltip
                            title={row.row.original.StudyInstanceUID}
                            placement="top"
                            onClick={() => {
                                navigator.clipboard.writeText(row.row.original.StudyInstanceUID)
                            }}
                        >
                            <IconButton>
                                <ContentCopy />
                            </IconButton>
                        </Tooltip>
                    )
                },
            },

            { accessor: 'PatientName', Header: '姓名', Cell: (row) => row.row.original.PatientName['Alphabetic'] },
            { accessor: 'PatientID', Header: '身分證字號', Cell: (row) => row.row.original.PatientID },
            { accessor: 'PatientSex', Header: '性別', Cell: (row) => row.row.original.PatientSex },
            {
                accessor: 'StudyDate',
                Header: '報告日期',
                Cell: (row) => {
                    if (moment(row.row.original.StudyDate, 'YYYYMMDD', true).isValid()) {
                        return (
                            <Box>
                                <Box>{moment(row.row.original.StudyDate, 'YYYYMMDD').format('YYYY/MM/DD')}</Box>
                                <Box sx={{ fontSize: '.8rem', color: 'gray.main' }}>
                                    {moment(row.row.original.StudyDate, 'YYYYMMDD').format('HH:mm:ss')}
                                </Box>
                            </Box>
                        )
                    } else {
                        return (
                            <Box>
                                <Box>{new Date(row.row.original.StudyDate).toLocaleDateString()}</Box>
                                <Box sx={{ fontSize: '.8rem', color: 'gray.main' }}>
                                    {new Date(row.row.original.StudyDate).toLocaleTimeString()}
                                </Box>
                            </Box>
                        )
                    }
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

export default Image
