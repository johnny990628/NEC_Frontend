import React, { useState, useEffect, useRef } from 'react'
import { styled } from '@mui/material/styles'
import { IconButton, ListItemText } from '@mui/material'
import { Close, Print } from '@mui/icons-material'
import { Box } from '@mui/system'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import InputLabel from '@mui/material/InputLabel'
import { FormControl, Menu, MenuItem, Select, Typography } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useReactToPrint } from 'react-to-print'
import reportdata from '../../Assets/Json/ReportCols.json'

const Preport = (props) => {
    const { info } = props
    const dispatch = useDispatch()
    const [version, setVersion] = useState('')
    const [report, setReport] = useState(reportdata)
    const descriptionElementRef = useRef(null)
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)

    const HorizonDiv = styled('div')({
        display: 'flex',
        flexDirection: 'row',
    })

    const handleClose = () => {
        props.setShowReport(false)
    }

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const formRef = useRef()
    const handlePrint = useReactToPrint({
        content: () => formRef.current,
    })

    return props.trigger ? (
        
            <Dialog
                open={props.trigger}
                onClose={handleClose}
                fullWidth
                maxWidth="md"
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
            >
                <DialogTitle sx={{display: 'flex', alignItems: 'center', padding: '.5rem 2rem'}}>
                    
                        <IconButton
                            aria-controls={open ? 'basic-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            onClick={handleClick}
                        >
                            <Print />
                        </IconButton>
                        <Dialog open={open}>
                            <Menu
                                id="basic-menu-list"
                                aria-labelledby="basic-button"
                                open={open}
                                onClose={(e) => setAnchorEl(null)}
                                anchorOrigin={{
                                    vertical: 'center',
                                    horizontal: 'center',
                                }}
                                transformOrigin={{
                                    vertical: 'center',
                                    horizontal: 'center',
                                }}
                            >
                                <MenuItem style={{ width: '10rem', height: '5rem' }} onClick={handlePrint}>
                                    正式報告
                                </MenuItem>
                                <MenuItem style={{ width: '10rem', height: '5rem' }} onClick={handlePrint}>
                                    簡易報告
                                </MenuItem>
                            </Menu>
                        </Dialog>

                        <ListItemText
                    primary={`${
                        info.patient ? `${info.patient.id} / ${info.patient.name} / ${info.patient.gender === 'm' ? '先生' : '小姐'}` : '無病人資料'
                    }`}
                    secondary={
                        <Box>
                            <Box>{`建立 : ${new Date(info.report.createdAt).toLocaleString()}`}</Box>
                            <Box>{`更新 : ${new Date(info.updatedAt).toLocaleString()}`}</Box>
                        </Box>
                    }
                />
                        {info.status !== 'wait-examination' && (
                            <FormControl size="small" variant="outlined" sx={{ width: '5rem', ml: 4 }}>
                                <InputLabel id="select-version">報告版本</InputLabel>
                                <Select
                                    labelId="select-version"
                                    label="報告版本"
                                    value={version}
                                    onChange={(e) => setVersion(e.target.value)}
                                >
                                    {info.report?.records &&
                                        info.report?.records.map((record, index) => (
                                            <MenuItem key={record.id} value={record.id}>{`v${index + 1}`}</MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                        )}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ height: '90vh', display: 'flex', justifyContent: 'center' }}>
                        <table ref={formRef}>
                            <thead>
                                <tr>
                                    <th>項目</th>
                                    <th>檢查結果及說明</th>
                                </tr>
                            </thead>
                            <tbody>
                            {reportdata.map((field) => (
                                <tr>
                                    <th>{field.label}</th>
                                </tr>
                                ))}
                            </tbody>
                        </table>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                </DialogActions>
            </Dialog>
        
    ) : (
        ''
    )
}

export default Preport