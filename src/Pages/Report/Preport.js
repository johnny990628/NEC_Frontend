import React, { useState, useEffect, useRef } from 'react'

// import { styled } from '@mui/material/styles'
import { IconButton, ListItemText, Grid, ListItem, useMediaQuery } from '@mui/material'
import { Print } from '@mui/icons-material'
import { Box } from '@mui/system'
import { useTheme } from '@mui/styles'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import InputLabel from '@mui/material/InputLabel'
import { FormControl, Menu, MenuItem, Select } from '@mui/material'

import { useReactToPrint } from 'react-to-print'

import useStyles from './Style'
import Circle from '../../Components/CustomReport/Circle'
import REPORTCOLS from '../../Assets/Json/ReportCols.json'
import REPORTCOLS2 from '../../Assets/Json/ReportCols2.json'

const Preport = (props) => {
    const { info } = props
    const [version, setVersion] = useState('')
    const [anchorEl, setAnchorEl] = useState(null)

    const circleSize = 150
    const theme = useTheme()
    const tab = useMediaQuery(theme.breakpoints.down('xl'))
    const open = Boolean(anchorEl)
    console.log(info)

    const handleClose = () => {
        props.setShowReport(false)
        setVersion('')
    }

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const OfficialformRef = useRef()
    const handleOfficialPrint = useReactToPrint({
        content: () => OfficialformRef.current,
    })

    const SimpleformRef = useRef()
    const handleSimplePrint = useReactToPrint({
        content: () => SimpleformRef.current,
    })

    const ReportOfficialFormForPDF = React.forwardRef((_, ref) => {
        return (
            <div style={{ width: '100%' }} ref={ref}>
                <FormHeader />
                <PatientForm />
                <ReportFormHtml print={true} />
                <FormFooter />
                <BiradsReportFormHtml />
            </div>
        )
    })

    const ReportSimpleFormForPDF = React.forwardRef((_, ref) => {
        return (
            <div style={{ width: '100%' }} ref={ref}>
                <FormHeader />
                <PatientForm />
                <SimpleReportFormHtml print={true} />
                <FormFooter />
            </div>
        )
    })

    const FormHeader = () => {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                <b style={{ fontSize: '1.5rem' }}>乳房超音波檢查報告單</b>
                <hr></hr>
                <div style={{ width: '90%', display: 'flex', justifyContent: 'space-between' }}>
                    <div>檢查日期 : {new Date(info.report.createdAt).toLocaleDateString()}</div>
                    <div>報告列印時間 : {new Date().toLocaleString()}</div>
                </div>
            </div>
        )
    }

    const PatientForm = () => {
        const classes = useStyles()

        const patient = info.patient

        return (
            <table className={classes.table} style={{ width: '90%', margin: 'auto' }}>
                <tr>
                    <td className={classes.table}>
                        <b>姓名</b>
                    </td>
                    {patient ? (
                        <td className={classes.table}>{patient?.name}</td>
                    ) : (
                        <td className={classes.table}>&emsp;&emsp;&emsp;</td>
                    )}
                    <td className={classes.table}>
                        <b>性別</b>
                    </td>
                    <td className={classes.table}>
                        <input type="checkbox" checked={patient?.gender === 'm'} readOnly />男
                        <input type="checkbox" checked={patient?.gender === 'f'} readOnly />女
                    </td>
                    <td className={classes.table}>
                        <b>出生年月日</b>
                    </td>
                    {patient ? (
                        <td className={classes.table}>{new Date(patient?.birth).toLocaleDateString()}</td>
                    ) : (
                        <td className={classes.table}>&emsp;&emsp;&emsp;</td>
                    )}
                </tr>
                <tr>
                    <td className={classes.table}>
                        <b>電話</b>
                    </td>
                    <td className={classes.table} colSpan="5">
                        {patient?.phone}
                    </td>
                </tr>
                <tr>
                    <td className={classes.table}>
                        <b>部門單位</b>
                    </td>
                    <td className={classes.table} colSpan="2">
                        {patient?.department}
                    </td>
                    <td className={classes.table}>
                        <b>身份證字號</b>
                    </td>
                    <td className={classes.table} colSpan="2">
                        {patient?.id}
                    </td>
                </tr>
            </table>
        )
    }

    const ReportFormHtml = () => {
        const classes = useStyles()
        const [cancerArr, setCancerArr] = useState([])
        useEffect(() => {
            if (version) {
                const currentReport = info.report.records.find((r) => r.id === version)
                setCancerArr(currentReport.summarize)
            }
        }, [version])

        return (
            <table className={classes.table} style={{ width: '90%', margin: 'auto' }}>
                <tbody>
                    {[...REPORTCOLS].map((list, i) => (
                        <>
                            {i === 1 && (
                                <tr>
                                    <td
                                        colSpan="4"
                                        className={classes.table}
                                        style={{ textAlign: 'center', height: '2rem' }}
                                    >
                                        <b>檢查適應症</b>
                                    </td>
                                </tr>
                            )}
                            {list.name === 'RADARMARK' && (
                                <tr>
                                    <td
                                        colSpan="4"
                                        className={classes.table}
                                        style={{ textAlign: 'center', height: '2rem' }}
                                    >
                                        <b>{list.label}</b>
                                    </td>
                                </tr>
                            )}
                            <FormSection
                                key={list.name}
                                list={list}
                                checked={cancerArr.some((c) => c.key === list.name)}
                                options={cancerArr.find((c) => c.key === list.name)?.value}
                                text={cancerArr.find((c) => c.key === list.name)?.value}
                            />
                        </>
                    ))}
                </tbody>
            </table>
        )
    }

    const BiradsReportFormHtml = () => {
        const classes = useStyles()
        const [cancerArr, setCancerArr] = useState([])
        useEffect(() => {
            if (version) {
                const currentReport = info.report.records.find((r) => r.id === version)
                setCancerArr(currentReport.summarize)
            }
        }, [version])

        return (
            <table className={classes.table} style={{ width: '90%', margin: 'auto' }}>
                <tbody>
                    {[...REPORTCOLS2].map((list, i) => (
                        <>
                            <FormSection
                                key={list.name}
                                list={list}
                                checked={cancerArr.some((c) => c.key === list.name)}
                                options={cancerArr.find((c) => c.key === list.name)?.value}
                                text={cancerArr.find((c) => c.key === list.name)?.value}
                            />
                        </>
                    ))}
                </tbody>
            </table>
        )
    }

    const SimpleReportFormHtml = () => {
        const classes = useStyles()
        const [biradsR, setBiradsR] = useState([])
        const [biradsL, setBiradsL] = useState([])
        useEffect(() => {
            if (version) {
                const currentReport = info.report.records.find((r) => r.id === version)
                setBiradsR(currentReport.report.R)
                setBiradsL(currentReport.report.L)
            }
        }, [version])

        return (
            <table className={classes.table} style={{ width: '90%', margin: 'auto' }}>
                <tbody>
                    <Grid sx={8}>
                        <Box display="flex">
                            <Box>
                                {['R'].map((side) => {
                                    return (
                                        <Box sx={{ margin: '1rem' }}>
                                            <Box sx={{ fontSize: '1.5rem' }}>{side}</Box>
                                            <Circle maxSize={circleSize} pos={biradsR} side={side} />
                                            <br />
                                            <b>Size :</b>
                                            {biradsR.length > 0 &&
                                                biradsR.map((props, index) => {
                                                    return <TumorList {...props} index={index} side="R" />
                                                })}
                                        </Box>
                                    )
                                })}
                            </Box>
                            <Box>
                                {['L'].map((side) => {
                                    return (
                                        <Box sx={{ margin: '1rem' }}>
                                            <Box sx={{ fontSize: '1.5rem' }}>{side}</Box>
                                            <Circle maxSize={circleSize} pos={biradsL} side={side} />
                                            <br />
                                            <b>Size :</b>
                                            {biradsL.length > 0 &&
                                                biradsL.map((props, index) => {
                                                    return <TumorList {...props} index={index} side="L" />
                                                })}
                                        </Box>
                                    )
                                })}
                            </Box>
                        </Box>
                        {[...REPORTCOLS2].map((list, i) => (
                            <Box>
                                <td>
                                    <b>{list.label}</b>
                                </td>

                                <td style={{ display: 'flex', width: '100%' }}>
                                    {list?.options?.map((option) => (
                                        <div style={{ width: '100%' }}>
                                            <input type="checkbox" value={option.value} readOnly />
                                            {option.label}
                                        </div>
                                    ))}
                                </td>
                            </Box>
                        ))}
                    </Grid>
                </tbody>
            </table>
        )
    }

    const FormSection = ({ list, checked, options, text }) => {
        const classes = useStyles()

        return list.section === 'Indication' ? (
            <tr>
                <td colSpan="4">
                    {(list.type === 'radio' || list.type === 'select' || list.type === 'multiple_select') && (
                        <>
                            <input type="checkbox" checked={checked} readOnly />
                            <b>{list.label}</b>
                            <>
                                {list.options.map((option) => {
                                    return (
                                        <>
                                            <input
                                                type="radio"
                                                value={option.value}
                                                checked={options?.includes(option.value)}
                                                readOnly
                                            />
                                            {option.label}
                                        </>
                                    )
                                })}
                            </>
                        </>
                    )}
                    {list.type === 'checkbox' && (
                        <>
                            <input type="checkbox" checked={checked} readOnly />
                            <b>{list.label}</b>
                        </>
                    )}
                    {list.type === 'text' && (
                        <>
                            <input type="checkbox" checked={checked} readOnly />
                            <b>{list.label} :</b> {text}
                        </>
                    )}
                </td>
            </tr>
        ) : (
            <tr className={`${classes.table} ${classes.printBreak}`}>
                {(list.type === 'redio' || list.type === 'select' || list.type === 'multiple_select') && (
                    <>
                        <td>
                            <input type="checkbox" checked={checked} readOnly />
                            <b>{list.label}</b>
                        </td>

                        <td className={classes.table}>
                            {list?.options?.map((option) => (
                                <div>
                                    <input
                                        type="radio"
                                        value={option.value}
                                        checked={options?.includes(option.value)}
                                        readOnly
                                    />
                                    {option.label}
                                </div>
                            ))}
                        </td>
                    </>
                )}
                {list.type === 'text' && (
                    <>
                        <td style={{ width: '10%', height: '3rem' }} className={classes.table}>
                            <b>{list.label}</b>
                        </td>
                        <td style={{ width: '10%' }} className={classes.table}>
                            {text}
                        </td>
                    </>
                )}
                {list.type === 'modal' && (
                    <>
                        {text && (
                            <td colSpan="4" className={classes.table}>
                                <div style={{ display: 'flex' }}>
                                    {['R', 'L'].map((side) => {
                                        return (
                                            <div
                                                style={{
                                                    width: '50%',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                {/* <DataShows azimut={JSON.parse(text)} side={side} /> */}
                                                {/* <Chest azimut={JSON.parse(text)} side={side} /> */}
                                            </div>
                                        )
                                    })}
                                </div>
                            </td>
                        )}
                    </>
                )}
            </tr>
        )
    }

    const TumorList = ({ side, clock, distance, size, index }) => {
        return (
            <ListItem>
                <ListItem>
                    <ListItemText
                        primary={`${side}${index + 1}`}
                        secondary={
                            <Box sx={{ fontSize: tab ? '.7rem' : '1rem', whiteSpace: 'nowrap' }}>
                                {`方位:${clock} 距離:${distance} 大小:${size}`}
                            </Box>
                        }
                    />
                </ListItem>
            </ListItem>
        )
    }

    const FormFooter = () => {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                {/* <p style={{ fontSize: '1.2rem' }}></p> */}
            </div>
        )
    }

    return props.trigger ? (
        <Dialog
            open={props.trigger}
            onClose={handleClose}
            fullWidth
            maxWidth="md"
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description"
        >
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', padding: '.5rem 2rem' }}>
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
                        <MenuItem style={{ width: '10rem', height: '5rem' }} onClick={handleOfficialPrint}>
                            正式報告
                        </MenuItem>
                        <MenuItem style={{ width: '10rem', height: '5rem' }} onClick={handleSimplePrint}>
                            簡易報告
                        </MenuItem>
                    </Menu>
                </Dialog>

                <ListItemText
                    primary={`${
                        info.patient
                            ? `${info.patient.id} / ${info.patient.name} / ${
                                  info.patient.gender === 'm' ? '先生' : '小姐'
                              }`
                            : '無病人資料'
                    }`}
                    secondary={
                        <Box>
                            <Box>{`建立 : ${new Date(info.report.createdAt).toLocaleString()}`}</Box>
                            <Box>{`更新 : ${new Date(info.updatedAt).toLocaleString()}`}</Box>
                        </Box>
                    }
                />
                {info.status !== 'wait-examination' && (
                    <FormControl size="small" variant="outlined" sx={{ width: '6rem' }}>
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
                    <ReportFormHtml />
                    <Box sx={{ display: 'none' }}>
                        <ReportOfficialFormForPDF ref={OfficialformRef} />
                        <ReportSimpleFormForPDF ref={SimpleformRef} />
                    </Box>
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
