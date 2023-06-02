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
} from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import { addPoint, setupBirads } from '../../../Redux/Slices/Breast'
import { Add } from '@mui/icons-material'
import { v4 } from 'uuid'
import DynamicForm from './DynmicForm'
import useStyles from '../Style'
import Circle from './Circle'

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
                                <Box sx={{ fontSize: '1rem', whiteSpace: 'nowrap' }}>
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
        <Box>
            <Grid container spacing={5} ml={1}>
                <Grid item xs={2}>
                    <List sx={{ width: '100%', maxWidth: 400 }}>
                        {report['R'].length > 0 &&
                            report['R'].map((props, index) => {
                                return <TumorList {...props} index={index} side="R" />
                            })}
                        <ListItem>
                            <ListItemButton onClick={() => handleMarkerClick({ side: 'R' })}>
                                <ListItemIcon>
                                    <Add />
                                </ListItemIcon>

                                <ListItemText primary={'新增腫瘤'} />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Grid>
                {['R', 'L'].map((side) => {
                    return (
                        <Grid item xs={4} display="flex" justifyContent="center" alignItems="center">
                            <Box>
                                <Box sx={{ fontSize: '1.5rem' }}>{side}</Box>
                                <Circle maxSize={200} pos={report[side]} side={side} focused={hovered} />
                                <FormControl variant="standard" sx={{ width: '6rem', mr: 2, marginBottom: '1em' }}>
                                    <InputLabel id="select-birads">BI-RADS</InputLabel>
                                    <Select
                                        labelId="select-birads"
                                        value={birads[side]}
                                        disabled={user.role === 4}
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
                        </Grid>
                    )
                })}
                <Grid item xs={2}>
                    <List sx={{ width: '100%', maxWidth: 360 }}>
                        {report['L'].length > 0 &&
                            report['L'].map((props, index) => <TumorList {...props} index={index} side="L" />)}
                        <ListItem>
                            <ListItemButton onClick={() => handleMarkerClick({ side: 'L' })}>
                                <ListItemIcon>
                                    <Add />
                                </ListItemIcon>
                                <ListItemText primary={'新增腫瘤'} />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Grid>
            </Grid>

            <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="lg">
                <DialogContent>
                    <DynamicForm id={id} side={side} focused={focus} label={label} />
                </DialogContent>
            </Dialog>
        </Box>
    )
}
export default ChestMarker
