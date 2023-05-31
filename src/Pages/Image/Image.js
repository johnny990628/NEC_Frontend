import React, { useEffect, useState } from 'react'
import { Box, Button, IconButton, Tooltip } from '@mui/material'
import { useDebouncedCallback } from 'use-debounce'
import moment from 'moment'
import FileDownload from 'js-file-download'
import useStyles from './Style'

import CustomTable from '../../Components/CustomTable/CustomTable'
import ReportDialog from '../../Components/ReportDialog/ReportDialog'
import GlobalFilter from './../../Components/GlobalFilter/GlobalFilter'
import GlobalFilterParams from './../../Components/GlobalFilterParams/GlobalFilterParams'
import CustomModal from '../../Components/CustomModal/CustomModal'
import { ArrowDropDown, ContentCopy, CloudDownload } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDicom } from './../../Redux/Slices/Dicom'
import axios from 'axios'
import { apiDownloadDCM } from '../../Axios/Dicom'
import CustomTableSetting from '../../Components/CustomTableForm/CustomTableSetting'
import filterParams from '../../Assets/Json/FilterParams.json'
import useAlert from '../../Hooks/useAlert'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'

const Image = () => {
    const dispatch = useDispatch()
    const classes = useStyles()
    const { results, count, page, loading } = useSelector((state) => state.dicom)

    const fetchData = async (params) => {
        dispatch(fetchDicom(params))
    }

    const [columns, setColumns] = useState([])
    const showAlert = useAlert()

    const SeriesColumns = [
        {
            accessor: 'SeriesInstanceUID',
            Header: 'SeriesInstanceUID',
        },
        {
            accessor: 'Number',
            Header: 'SeriesNumber',
        },
        {
            accessor: '	SeriesDescription',
            Header: 'SeriesDescription',
            Cell: (row) => row.row.original.SeriesDescription || 'null',
        },
        {
            accessor: 'Modality',
            Header: 'Modality',
        },
        {
            accessor: 'OpenSeries',
            Header: 'OpenSeries',
            Cell: (row) => (
                <Button
                    variant="outlined"
                    endIcon={<OpenInNewIcon />}
                    onClick={() => {
                        const iframeURL = `${process.env.REACT_APP_BLUELIGHT_URL}?StudyInstanceUID=${row.row.original.StudyInstanceUID}&SeriesInstanceUID=${row.row.original.SeriesInstanceUID}`
                        window.open(iframeURL, '_blank')
                    }}
                >
                    Open Series
                </Button>
            ),
        },
        {
            accessor: 'instances',
            Header: 'Instances',
            Cell: (row) => <Button>{row.row.original.instances.length}</Button>,
        },
    ]

    useEffect(() => {
        setColumns([
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
                showInCustomTable: true,
                required: false,
            },
            {
                accessor: 'PatientName',
                Header: '姓名',
                Cell: (row) => row.row.original.PatientName['Alphabetic'],
                showInCustomTable: true,
                required: true,
            },
            {
                accessor: 'PatientID',
                Header: '身分證字號',
                Cell: (row) => row.row.original.PatientID,
                showInCustomTable: true,
                required: true,
            },
            {
                accessor: 'AccessionNumber',
                Header: 'AccessionNumber',
                Cell: (row) => row.row.original.AccessionNumber || 'null',
                showInCustomTable: true,
                required: false,
            },
            {
                accessor: 'PatientSex',
                Header: '性別',
                Cell: (row) => row.row.original.PatientSex,
                showInCustomTable: true,
                required: false,
            },
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
                showInCustomTable: true,
                required: false,
            },
            {
                accessor: 'OPENBLUELIGHT',
                Header: '打開Viewer',
                Cell: (row) => (
                    <Button
                        variant="outlined"
                        sx={{ ml: 2 }}
                        endIcon={<OpenInNewIcon />}
                        onClick={() => {
                            const iframeURL = `${process.env.REACT_APP_BLUELIGHT_URL}?StudyInstanceUID=${row.row.original.StudyInstanceUID}`
                            window.open(iframeURL, '_blank')
                        }}
                    >
                        在新分頁開啟
                    </Button>
                ),
                showInCustomTable: true,
                required: true,
            },
            {
                accessor: 'Series',
                Header: 'Series內容',
                Cell: (row) => (
                    <Button
                        variant="outlined"
                        onClick={() => {
                            showAlert({
                                icon: 'success',
                                type: 'table',
                                columns: SeriesColumns,
                                data: row.row.original.series,
                            })
                        }}
                    >
                        open series-{row.row.original.series.length}
                    </Button>
                ),
                showInCustomTable: true,
                required: true,
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
                showInCustomTable: true,
                required: false,
            },
        ])
    }, [])
    return (
        <Box className={classes.container}>
            <CustomTable
                columns={columns.filter((column) => column.showInCustomTable === true)}
                originalColumns={columns}
                setColumns={setColumns}
                fetchData={fetchData}
                data={results}
                loading={loading}
                totalPage={page}
                totalCount={count}
                GlobalFilterParams={GlobalFilterParams}
                filterParams={filterParams}
            />
            <ReportDialog mode="edit" />
        </Box>
    )
}

export default Image
