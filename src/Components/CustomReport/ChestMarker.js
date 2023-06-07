import React, { useEffect, useMemo, useState } from 'react'

import {
    Box,
    Grid,
    Tooltip,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    List,
    ListItem,
    IconButton,
    ListItemText,
    ListItemButton,
    ListItemIcon,
    Dialog,
    DialogContent,
    Popover,
    DialogActions,
    Button,
    useMediaQuery,
} from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import { addPoint, setupBirads } from '../../Redux/Slices/Breast'
import { Add } from '@mui/icons-material'
import { v4 } from 'uuid'
import TurmorForm from './TumorForm'
import useStyles from './Style'
import Circle from './Circle'
import CustomScrollbar from '../CustomScrollbar/CustomScrollbar'
import { removePoint } from '../../Redux/Slices/Breast'
import { useTheme } from '@mui/styles'
import useAlert from '../../Hooks/useAlert'

function ChestMarker({}) {
    const classes = useStyles()
    const dispatch = useDispatch()
    const { report, birads } = useSelector((state) => state.breast)
    const { user } = useSelector((state) => state.auth)
    const [hovered, setHovered] = useState({ side: '', index: -1 })
    const [dialogOpen, setDialogOpen] = useState(false)
    const [id, setId] = useState('')
    const [side, setSide] = useState('')
    const [label, setLabel] = useState('')
    const [focus, setFocus] = useState({ side: '', index: -1 })
    const [circleSize, setCircle] = useState(200)

    const showAlert = useAlert()

    const theme = useTheme()
    const tab = useMediaQuery(theme.breakpoints.down('xl'))

    useEffect(() => {
        if (tab) setCircle(150)
        else setCircle(200)
    }, [tab])

    const handleMarkerClick = ({ side, id, index }) => {
        if (id) {
            setId(id)
            setLabel(`${side}${index + 1}`)
            setFocus({ side, index })
        } else {
            const randomID = v4()
            dispatch(addPoint({ side, id: randomID }))
            setId(randomID)
            setLabel(`${side}${report[side].length + 1}`)
            setFocus({ side, index: report[side].length + 1 })
        }
        setSide(side)
        setDialogOpen(true)
    }
    const handleDialogClose = () => {
        setDialogOpen(false)
        setFocus({ side: '', index: -1 })
    }

    const handleDeletePoint = ({ side, id }) => {
        setDialogOpen(false)
        showAlert({
            alertTitle: `確定要刪除該腫瘤?`,
            toastTitle: '刪除腫瘤',
            text: '',
            type: 'confirm',
            event: async () => {
                dispatch(removePoint({ side, id }))
            },
        })
    }

    const TumorList = ({ side, clock, distance, size, id, form, index }) => {
        const handleMarkerEnter = ({ side = '', index = 0 }) => {
            setHovered({ side, index })
        }
        const handleMarkerLeave = () => {
            setHovered({ side: '', index: -1 })
        }
        return (
            <ListItem secondaryAction={<IconButton></IconButton>}>
                <Tooltip
                    title={
                        <Box>
                            <Box
                                sx={{ fontSize: '1.2rem', whiteSpace: 'nowrap' }}
                            >{`方位:${clock} 距離:${distance} 大小:${size}`}</Box>
                            {form.map(({ key, value }) => (
                                <Box key={key} sx={{ fontSize: '1rem', mt: '.3rem' }}>
                                    <Box sx={{ fontWeight: 'bold' }}>{key}</Box>
                                    <Box>{value}</Box>
                                </Box>
                            ))}
                        </Box>
                    }
                    placement="right"
                    arrow
                    classes={{ tooltip: classes.tooltip }}
                >
                    <ListItemButton
                        onClick={() => handleMarkerClick({ side, id, index })}
                        onMouseEnter={() => handleMarkerEnter({ side, index })}
                        onMouseLeave={handleMarkerLeave}
                    >
                        <ListItemText
                            primary={`${side}${index + 1}`}
                            secondary={
                                <Box sx={{ fontSize: tab ? '.7rem' : '1rem', whiteSpace: 'nowrap' }}>
                                    {`方位:${clock} 距離:${distance} 大小:${size}`}
                                </Box>
                            }
                        />
                    </ListItemButton>
                </Tooltip>
            </ListItem>
        )
    }

    return (
        <Box sx={{ height: '100%' }}>
            <Grid container spacing={2} sx={{ height: '100%' }}>
                <Grid item xs={2}>
                    <List sx={{ maxWidth: 300, height: '80vh', overflowY: 'auto' }}>
                        <CustomScrollbar>
                            {report['R'].length > 0 &&
                                report['R'].map((props, index) => {
                                    return <TumorList {...props} index={index} side="R" />
                                })}
                            <ListItem>
                                <ListItemButton onClick={() => handleMarkerClick({ side: 'R' })}>
                                    <ListItemIcon sx={{ minWidth: '2rem' }}>
                                        <Add />
                                    </ListItemIcon>

                                    <ListItemText primary={'新增腫瘤'} />
                                </ListItemButton>
                            </ListItem>
                        </CustomScrollbar>
                    </List>
                </Grid>
                <Grid item xs={8} display="flex" justifyContent="center">
                    {['R', 'L'].map((side) => {
                        return (
                            <Box>
                                <Box sx={{ fontSize: '1.5rem' }}>{side}</Box>
                                <Circle maxSize={circleSize} pos={report[side]} side={side} focused={hovered} />
                                <FormControl variant="standard" sx={{ width: '6rem', mr: 2, marginBottom: '1em' }}>
                                    <InputLabel id="select-birads">BI-RADS</InputLabel>
                                    <Select
                                        labelId="select-birads"
                                        value={birads[side]}
                                        disabled={user.role < 3}
                                        onChange={(e) => {
                                            dispatch(setupBirads({ side, value: e.target.value }))
                                        }}
                                    >
                                        {[1, 2, 3, 4, 5, 6].map((b) => (
                                            <MenuItem key={b} value={b}>{`${b}類`}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>
                        )
                    })}
                </Grid>
                <Grid item xs={2}>
                    <List sx={{ maxWidth: 400, height: '80vh', overflowY: 'auto' }}>
                        <CustomScrollbar>
                            {report['L'].length > 0 &&
                                report['L'].map((props, index) => <TumorList {...props} index={index} side="L" />)}
                            <ListItem>
                                <ListItemButton onClick={() => handleMarkerClick({ side: 'L' })}>
                                    <ListItemIcon sx={{ minWidth: '2rem' }}>
                                        <Add />
                                    </ListItemIcon>
                                    <ListItemText primary={'新增腫瘤'} />
                                </ListItemButton>
                            </ListItem>
                        </CustomScrollbar>
                    </List>
                </Grid>
            </Grid>

            <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="lg">
                <DialogContent>
                    <TurmorForm id={id} side={side} focused={focus} label={label} />
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" color="primary" onClick={() => setDialogOpen(false)}>
                        確認
                    </Button>
                    <Button color="red" onClick={() => handleDeletePoint({ side, id })}>
                        刪除腫瘤
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}
export default ChestMarker
