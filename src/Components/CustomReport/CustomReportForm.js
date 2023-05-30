import React, { useState, useEffect, useMemo } from 'react'
import {
    Box,
    useMediaQuery,
    Grid,
    Chip,
    IconButton,
    Button,
    Stack,
    CircularProgress,
    Tooltip,
    Badge,
    Popover,
    Popper,
} from '@mui/material'
import { useTheme } from '@mui/styles'
import useStyles from './Style'

import CustomReportInput from './CustomReportInput'
import CustomScrollbar from '../../Components/CustomScrollbar/CustomScrollbar'
import { useDispatch, useSelector } from 'react-redux'

import { Cast, History, Mic } from '@mui/icons-material'
import useSpeech2Text from '../../Hooks/useSpeech2Text'
import PROCEDURECODE from '../../Assets/Json/ProcedureCode.json'
import ChestMarker from './Component/ChestMarker'

const FormSection = ({ list, mode }) => {
    const classes = useStyles()

    const report = useSelector((state) => state.reportForm.report)

    const setupValue = (list) => {
        if (report) return report?.find((r) => r.name === list.name)
    }

    return (
        <Box className={classes.formContainer}>
            <CustomReportInput key={list.label} row={list} input={setupValue(list)} mode={mode} />
        </Box>
    )
}

const CustomReportForm = ({ schedule }) => {
    const classes = useStyles()
    const theme = useTheme()
    const isComputer = useMediaQuery(theme.breakpoints.up('lg'))
    const dispatch = useDispatch()
    const [audio] = useState(new Audio('./audio.mp3'))
    const [historyAnchorEl, setHistoryAnchorEl] = useState(null)
    const [dicomAnchorEl, setDicomAnchorEl] = useState(null)

    const { transcript, setRecord, listening } = useSpeech2Text()

    // const speechAction = useDebouncedCallback(() => {
    //     // 辨識的疾病名稱，使用Regex防止疾病含有相同的字串
    //     const cancerOfTranscript = commandList.find(col => new RegExp(col.label).test(transcript))
    //     // 辨識的器官名稱
    //     const organOfTranscript = lists.find(list => transcript.includes(list.label))

    //     //如果語音含有疾病名稱
    //     if (!!cancerOfTranscript) {
    //         // 疾病的器官
    //         const organOfCancer = lists.find(list => list.cols.find(l => l.name === cancerOfTranscript.name))

    //         if (cancerOfTranscript.type === 'radio') {
    //             const option = cancerOfTranscript.options.find(option => transcript.includes(option.label))
    //             if (option) {
    //                 dispatch(
    //                     addCancer({
    //                         organ: organOfCancer.name,
    //                         name: cancerOfTranscript.name,
    //                         type: cancerOfTranscript.type,
    //                         value: [option.value],
    //                         mode,
    //                     })
    //                 )
    //                 audio.play()
    //             }
    //         }

    //         if (cancerOfTranscript.type === 'checkbox') {
    //             dispatch(
    //                 addCancer({
    //                     organ: organOfCancer.name,
    //                     name: cancerOfTranscript.name,
    //                     type: cancerOfTranscript.tㄓype,
    //                     value: true,
    //                     mode,
    //                 })
    //             )
    //             audio.play()
    //         }
    //     }

    //     //如果語音含有器官名稱
    //     if (!!organOfTranscript) {
    //         // 清除器官
    //         if (transcript.includes('清除')) dispatch(clearCancer({ organ: organOfTranscript.name, name: organOfTranscript.name, mode }))
    //         // 新增備註
    //         else
    //             dispatch(
    //                 addCancer({
    //                     organ: organOfTranscript.name,
    //                     name: 'other',
    //                     type: 'text',
    //                     value: transcript.replace(organOfTranscript.label, ''),
    //                     mode,
    //                 })
    //             )
    //         audio.play()
    //     }
    // }, 250)

    // useEffect(() => {
    //     speechAction()
    // }, [transcript])

    const [toolkitOpen, setToolkitOpen] = useState(false)
    const handleRecordClick = (e) => {
        setRecord((s) => !s)
        setToolkitOpen((b) => !b)
    }

    const handleHistoryClick = (event) => {
        setHistoryAnchorEl(event.currentTarget)
    }

    const handleDicomClick = (event) => {
        window.open(`${process.env.REACT_APP_BLUELIGHT_URL}?PatientID=${schedule.patient.id}`, '_blank')
        // setDicomAnchorEl((dicom) => (dicom ? null : event.currentTarget))
    }

    // const HistoryPopover = () => {
    //     const handleClose = () => {
    //         setHistoryAnchorEl(null)
    //     }
    //     const { reports, reportID } = schedule

    //     return (
    //         <Popover
    //             open={Boolean(historyAnchorEl)}
    //             anchorEl={historyAnchorEl}
    //             onClose={handleClose}
    //             anchorOrigin={{
    //                 vertical: 'bottom',
    //                 horizontal: 'left',
    //             }}
    //             classes={{ paper: classes.popover }}
    //         >
    //             <ReportList reports={reports.filter((r) => r._id !== reportID)} />
    //         </Popover>
    //     )
    // }

    const DicomPopper = () => {
        return (
            <Popper open={Boolean(dicomAnchorEl)} anchorEl={dicomAnchorEl}>
                <iframe src={process.env.REACT_APP_BLUELIGHT_URL} style={{ height: '70vh', width: '45vw' }} />
            </Popper>
        )
    }
    // Prevent Component Rerender
    const DicomPopperCom = useMemo(() => <DicomPopper />, [dicomAnchorEl])

    // const config = genConfig(schedule.patient.id)

    return (
        <>
            <Box className={classes.container}>
                <Grid container sx={{ height: '100%' }}>
                    <Grid item xs={12}>
                        <CustomScrollbar>
                            <ChestMarker />
                        </CustomScrollbar>
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}

export default CustomReportForm
