import React, { useEffect, useState } from 'react'

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
} from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import { addPoint, setupBirads } from '../../../Redux/Slices/Breast'
import { Add } from '@mui/icons-material'
import { v4 } from 'uuid'
import DynamicForm from './DynmicForm'

function ChestMarker({}) {
    const dispatch = useDispatch()
    const { report, CHESTMAXSIZE, CHESTMAXRADIUS, birads } = useSelector((state) => state.breast)
    const { user } = useSelector((state) => state.auth)
    const [hovered, setHovered] = useState({ side: '', index: 0 })
    const [dialogOpen, setDialogOpen] = useState(false)
    const [id, setId] = useState('')

    const lines = Array.from({ length: 12 }).map((_, i) => {
        const angle = i * 30
        const x = 200 + Math.sin((angle * Math.PI) / 180) * 200
        const y = 200 - Math.cos((angle * Math.PI) / 180) * 200
        return { x, y }
    })

    const handleMarkerHover = ({ side = '', index = 0 }) => {
        setHovered({ side, index })
    }
    const handleMarkerClick = (markerId) => {
        if (markerId) {
            setId(markerId)
        } else {
            const randomID = v4()
            dispatch(addPoint({ side: 'R', id: randomID }))
            setId(randomID)
        }
        setDialogOpen(true)
    }

    const Circle = ({ pos, side }) => {
        return (
            <svg width="400" height="400">
                <circle cx="200" cy="200" r="200" fill="#efefef" />

                {lines.map(({ x, y }, i) => (
                    <line key={i} x1="200" y1="200" x2={x} y2={y} stroke="black" strokeWidth="0.5" />
                ))}

                {pos.map(({ id, clock, distance, size }, index) => {
                    const angle = (clock * 360) / 12 + 180
                    const radians = (angle * Math.PI) / 180
                    const x = CHESTMAXSIZE - Math.sin(radians) * distance * (CHESTMAXSIZE / CHESTMAXRADIUS)
                    const y = CHESTMAXSIZE + Math.cos(radians) * distance * (CHESTMAXSIZE / CHESTMAXRADIUS)
                    return (
                        <Tooltip key={id} title={`${side}${index + 1}`}>
                            <circle
                                cx={x}
                                cy={y}
                                r={size * 10}
                                fill={hovered.side === side && hovered.index === index ? 'yellow' : 'red'}
                            />
                            {/* <text
                                    font-size="12"
                                    x={x}
                                    y={y}
                                    text-anchor="middle"
                                    dominant-baseline="middle"
                                    fill="black"
                                >
                                    {side + (index + 1).toString()}
                                </text> */}
                        </Tooltip>
                    )
                })}
            </svg>
        )
    }
    return (
        <Box>
            <Grid container spacing={5} ml={1}>
                <Grid item xs={2}>
                    <List sx={{ width: '100%', maxWidth: 360 }}>
                        {report['R'].length > 0 &&
                            report['R'].map(({ clock, distance, size, id, form }, index) => (
                                <ListItem key={id} secondaryAction={<IconButton></IconButton>}>
                                    <ListItemButton
                                        onClick={() => handleMarkerClick(id)}
                                        onMouseEnter={() => handleMarkerHover({ side: 'R', index })}
                                        onMouseLeave={handleMarkerHover}
                                    >
                                        <ListItemText
                                            primary={`R${index + 1}`}
                                            secondary={`方位:${clock} 距離:${distance} 大小:${size}`}
                                        />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        <ListItem>
                            <ListItemButton onClick={() => handleMarkerClick()}>
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
                                <Circle pos={report[side]} side={side} />
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
                            report['L'].map(({ clock, distance, size, id, form }, index) => (
                                <ListItem key={id} disableGutters secondaryAction={<IconButton></IconButton>}>
                                    <ListItemButton
                                        onMouseEnter={() => handleMarkerHover({ side: 'L', index })}
                                        onMouseLeave={handleMarkerHover}
                                    >
                                        <ListItemText
                                            primary={`L${index + 1}`}
                                            secondary={`方位:${clock} 距離:${distance} 大小:${size}`}
                                        />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                    </List>
                </Grid>
                {/* <Grid container item xs={12}>
                    {['R', 'L'].map((side) => {
                        return (
                            <Grid key={side} item xs={6} sx={{ pl: 3 }}>
                                <DataShows side={side} />
                            </Grid>
                        )
                    })}
                </Grid> */}
            </Grid>
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md">
                <DialogContent>
                    <DynamicForm id={id} side="R" />
                </DialogContent>
            </Dialog>
        </Box>
    )
}

export default ChestMarker
