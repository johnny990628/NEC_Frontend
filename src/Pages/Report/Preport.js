import React, { useState, useEffect, useRef } from 'react'
import { styled } from '@mui/material/styles'
import { useDispatch, useSelector } from 'react-redux'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import InputLabel from '@mui/material/InputLabel'
import { FormControl, Menu, MenuItem, Select, Typography } from '@mui/material'
import { fetchSchedule } from '../../Redux/Slices/Schedule'
import { fetchReportByReportID } from '../../Redux/Slices/Breast'
import * as AiIcons from 'react-icons/ai'

const Preport = (props) => {
    const { info } = props
    const dispatch = useDispatch()
    const [version, setVersion] = useState('')
    const [selection, setSelection] = useState({})
    const descriptionElementRef = useRef(null)
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)

    const Schedule = useSelector((state) => state.schedule)
    const Report = useSelector((state) => state.breast)

    const HorizonDialogTitle = styled(DialogTitle)({
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
    })

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

    const CClose = () => {
        setAnchorEl(null)
    }

    return props.trigger ? (
        <>
            <Dialog
                open={props.trigger}
                onClose={handleClose}
                maxWidth="md"
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
            >
                <HorizonDialogTitle id="scroll-dialog-title">
                    <HorizonDiv>
                        <Button
                            id="basic-button"
                            aria-controls={open ? 'basic-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            onClick={handleClick}
                        >
                            <AiIcons.AiOutlinePrinter style={{ fontSize: '2rem' }} />
                        </Button>
                        <Dialog id="basic-menu" open={open}>
                            <Menu
                                id="basic-menu-list"
                                aria-labelledby="basic-button"
                                open={open}
                                onClose={CClose}
                                anchorOrigin={{
                                    vertical: 'center',
                                    horizontal: 'center',
                                }}
                                transformOrigin={{
                                    vertical: 'center',
                                    horizontal: 'center',
                                }}
                            >
                                <MenuItem style={{ width: '10rem', height: '5rem' }} onClick={CClose}>
                                    正式報告
                                </MenuItem>
                                <MenuItem style={{ width: '10rem', height: '5rem' }} d onClick={CClose}>
                                    簡易報告
                                </MenuItem>
                            </Menu>
                        </Dialog>

                        <div>
                            <Typography variant="h5">{info.patientID}/Apollo/Mr.</Typography>
                            <Typography>Create:2023/6/2 PM 2:12:52</Typography>
                            <Typography>Update:2023/6/2 PM 2:12:52</Typography>
                        </div>
                    </HorizonDiv>

                    <FormControl sx={{ minWidth: 120 }}>
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
                    </FormControl>
                </HorizonDialogTitle>
                <DialogContent>
                    <DialogContentText
                        id="scroll-dialog-description"
                        ref={descriptionElementRef}
                        tabIndex={-1}
                    ></DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </>
    ) : (
        ''
    )
}

export default Preport