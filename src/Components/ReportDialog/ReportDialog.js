import React, { useState, useEffect, useRef } from 'react'
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogActions,
    IconButton,
    ListItemText,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { Close, Print } from '@mui/icons-material'
import { v4 } from 'uuid'
import { useReactToPrint } from 'react-to-print'
import Avatar, { genConfig } from 'react-nice-avatar'

import useStyles from './Style'

import { closeDialog } from '../../Redux/Slices/Dialog'
import CustomReportForm from '../CustomReport/CustomReportForm'
import ReportFormHtml, { ReportFormForPDF } from './ReportFormHtml'
import { updateReport, fillReport, resetReport } from '../../Redux/Slices/ReportForm'
import { Box } from '@mui/system'
import Authorized from '../PrivateRoute/PrivateRoute'

import REPORTCOLS from '../../Assets/Json/ReportCols.json'
import REPORTCOLS2 from '../../Assets/Json/ReportCols2.json'
import { getConfig } from '@testing-library/react'
import useAlert from '../../Hooks/useAlert'

const ReportDialog = ({ mode }) => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const showAlert = useAlert()
    const {
        isOpen,
        row: { patient, user, createdAt, updatedAt, records, reportID },
    } = useSelector((state) => state.dialog.report)

    const report = useSelector((state) => state.reportForm.edit)
    const { user: currentUser } = useSelector((state) => state.auth)
    const [version, setVersion] = useState('')
    const [isEditing, setIsEditing] = useState(false)

    // 當Dialog開啟時，將最新的報告紀錄寫入Report State，並記錄該報告的ID
    useEffect(() => {
        if (records.length > 0 && isOpen) {
            dispatch(fillReport({ report: records[0].report }))
            setVersion(records[0].id)
            console.log(patient.id)
        }
    }, [isOpen])

    useEffect(() => {
        if (isOpen) dispatch(fillReport({ report: records.find((r) => r.id === version).report }))
    }, [version])

    const handleEdit = () => {
        // 點擊編輯按鈕後判斷目前Dialog狀態，如果為編輯狀態則儲存
        if (isEditing) {
            dispatch(updateReport({ reportID, data: { report: { report, id: v4() }, status: 'finished' } }))
            showAlert({
                toastTitle: '報告修改成功',
                text: `${patient.name} ${patient.gender === 'm' ? '先生' : '小姐'}`,
            })

            handleClose()
        } else {
            setIsEditing(true)
        }
    }
    const handleClose = () => {
        dispatch(closeDialog({ type: 'report' }))
        dispatch(resetReport({ mode: 'edit' }))
        setIsEditing(false)
    }
    const handleSelectOnChange = (e) => {
        setVersion(e.target.value)
    }

    const formRef = useRef()
    const handlePrint = useReactToPrint({
        content: () => formRef.current,
    })
    // const config = getConfig(patient.id)

    return (
        <Dialog open={isOpen} onClose={handleClose} fullWidth maxWidth={'md'}>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', padding: '0 2rem' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <Box className={classes.patientInfo}>
                        {/* <Avatar style={{ width: '4rem', height: '4rem', mr: 2 }} {...config}></Avatar> */}
                        <Box sx={{ m: 2 }}>
                            <Box sx={{ fontSize: '1.6rem' }}>{patient.name}</Box>
                            <Box sx={{ fontSize: '1rem', color: 'text.gray', ml: '.2rem' }}>{patient.id}</Box>
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {mode === 'edit' && (
                            <FormControl variant="standard" sx={{ width: '5rem' }}>
                                <InputLabel id="select-label">版本</InputLabel>
                                <Select labelId="select-label" value={version} onChange={handleSelectOnChange}>
                                    {records.length > 0 &&
                                        records.map((record, index) => (
                                            <MenuItem key={record.id} value={record.id}>{`v${
                                                records.length - index
                                            }`}</MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                        )}

                        {!isEditing && (
                            <Button startIcon={<Print />} onClick={handlePrint} sx={{ marginRight: '1rem' }}>
                                列印
                            </Button>
                        )}

                        {mode === 'create' && (
                            <IconButton onClick={handleClose} sx={{ padding: '1rem' }}>
                                <Close />
                            </IconButton>
                        )}
                    </Box>
                </Box>
            </DialogTitle>
            <DialogContent sx={{ height: '100vh', display: 'flex', justifyContent: 'center' }}>
                {isEditing ? (
                    <CustomReportForm cols1={REPORTCOLS} cols2={REPORTCOLS2} patient={patient} mode="edit" />
                ) : (
                    <>
                        <ReportFormHtml />
                        {/* For PDF Print */}
                        <Box sx={{ display: 'none' }}>
                            <ReportFormForPDF ref={formRef} />
                        </Box>
                    </>
                )}
            </DialogContent>
            <DialogActions sx={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 2rem' }}>
                <Box sx={{ fontSize: '.8rem' }}>
                    <Box>{`建立 : ${new Date(createdAt).toLocaleString()}`}</Box>
                    <Box>{`更新 : ${new Date(updatedAt).toLocaleString()}`}</Box>
                </Box>
                <Box>
                    {mode === 'edit' && (
                        <Authorized currentRole={currentUser.role} authority={[3, 2]} noMatch={<></>}>
                            <Button variant="contained" className={classes.actionButton} onClick={handleEdit}>
                                {isEditing ? '儲存' : '修改'}
                            </Button>
                            <Button variant="text" className={classes.actionButton} onClick={handleClose}>
                                取消
                            </Button>
                        </Authorized>
                    )}
                </Box>
            </DialogActions>
        </Dialog>
    )
}

export default ReportDialog
