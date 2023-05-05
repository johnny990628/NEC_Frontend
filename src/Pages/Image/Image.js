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
import FileDownload from 'js-file-download'
import useStyles from './Style'

import CustomTable from '../../Components/CustomTable/CustomTable'
import ReportDialog from '../../Components/ReportDialog/ReportDialog'
import GlobalFilter from './../../Components/GlobalFilter/GlobalFilter'
import { ArrowDropDown, ContentCopy, CloudDownload } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDicom } from './../../Redux/Slices/Dicom'
import axios from 'axios'
import { apiDownloadDCM } from '../../Axios/Dicom'

const Image = () => {
    const dispatch = useDispatch()
    const classes = useStyles()
    const { results, count, page, loading } = useSelector((state) => state.dicom)
    const [file, setFile] = useState(null)

    const fetchData = async (params) => {
        dispatch(fetchDicom(params))
    }

    const columns = useMemo(
        () => [
            {
                accessor: 'image',
                Header: '超音波',
                Cell: (row) => (
                    <Button
                        onClick={() => {
                            const iframeURL = `${process.env.REACT_APP_BLUELIGHT_URL}?StudyInstanceUID=${row.row.original.StudyInstanceUID}`
                            window.open(iframeURL, '_blank')
                        }}
                    >
                        <img
                            src={row.row.original.imageURL}
                            alt={row.row.original.StudyInstanceUID}
                            width={80}
                            height={100}
                        />
                    </Button>
                ),
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
            {
                accessor: 'StudyInstanceUID',
                Header: '報告ID',
                Cell: (row) => (
                    <>
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
                        <Button
                            variant="outlined"
                            sx={{ ml: 2 }}
                            onClick={() => {
                                const iframeURL = `${process.env.REACT_APP_BLUELIGHT_URL}?StudyInstanceUID=${row.row.original.StudyInstanceUID}`
                                window.open(iframeURL, '_blank')
                            }}
                        >
                            在新分頁開啟
                        </Button>
                    </>
                ),
            },
            {
                accessor: 'DownloadDCM',
                Header: '下載DCM',
                Cell: (row) => (
                    <IconButton
                        onClick={async () => {
                            const studyUID = row.row.original.StudyInstanceUID
                            const responseDCM = await apiDownloadDCM(studyUID)
                            const blob = new Blob([responseDCM.data], { type: 'application/octet-stream' })
                            const url = window.URL.createObjectURL(blob)
                            const link = document.createElement('a')
                            link.href = url
                            link.setAttribute('download', `${studyUID}.rar`)
                            document.body.appendChild(link)
                            link.click()
                        }}
                    >
                        <CloudDownload />
                    </IconButton>
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

export default Image
