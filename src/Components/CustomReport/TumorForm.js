import { useEffect, useRef, useState } from 'react'
import { TextField, FormControl, InputLabel, Select, MenuItem, Box, Grid } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { updatePoint } from '../../Redux/Slices/Breast'

import ReportForm from '../../Assets/Json/ReportCols2.json'
import useStyles from './Style'
import Circle from './Circle'

const TumorForm = ({ side, label, id, focused }) => {
    const dispatch = useDispatch()
    const classes = useStyles()
    const { report, CHESTMAXRADIUS, TUMORMAXSIZE } = useSelector((state) => state.breast)
    const [clock, setClock] = useState(12)
    const [size, setSize] = useState(1)
    const [form, setForm] = useState([])
    const [distance, setDistance] = useState(0)

    useEffect(() => {
        if (id) {
            const inputForm = report[side].find((r) => r.id === id)
            setSize((size) => (inputForm.size ? inputForm.size : size))
            setClock((clock) => (inputForm.clock ? inputForm.clock : clock))
            setDistance((distance) => (inputForm.distance ? inputForm.distance : distance))
            setForm((form) => (inputForm.form ? inputForm.form : form))
        }
    }, [id])

    useEffect(() => {
        dispatch(updatePoint({ side, id, data: { id, clock, distance: distance * 1, size: size * 1, form } }))
    }, [clock, size, distance, form])

    const handleAngleChange = (e) => {
        setClock(e.target.value)
    }
    const handleSizeChange = (e) => {
        const s = e.target.value * 1
        setSize(s <= TUMORMAXSIZE ? s : TUMORMAXSIZE)
    }
    const handleDistanceChange = (e) => {
        setDistance(e.target.value <= CHESTMAXRADIUS ? e.target.value : CHESTMAXRADIUS)
    }

    const handleSelectChange = ({ e, name }) => {
        if (e.target.value) {
            setForm([...form, { key: name, value: e.target.value }])
        } else {
            const tmpForm = form.filter((f) => f.key !== name)
            setForm([...tmpForm])
        }
    }

    return (
        <Box>
            <Grid container mb={6} sx={{ width: '100%' }} spacing={4}>
                <Grid item xs={2}>
                    <Box sx={{ fontSize: '2rem', fontWeight: 'bold' }}>{label}</Box>
                    <Circle maxSize={80} pos={report[side]} side={side} focused={focused} />
                </Grid>
                <Grid item xs={3.3} display="flex" alignItems="center">
                    <Box className={classes.selectLabel}>方向</Box>
                    <FormControl fullWidth>
                        <InputLabel id="select-angle">方向</InputLabel>
                        <Select
                            size="small"
                            labelId="select-angle"
                            label="方向"
                            value={clock}
                            onChange={handleAngleChange}
                        >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item) => (
                                <MenuItem key={item} value={item}>
                                    {item}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={3.3} display="flex" alignItems="center">
                    <Box className={classes.selectLabel}>距離</Box>
                    <TextField
                        fullWidth
                        size="small"
                        label="距離"
                        type="number"
                        set="any"
                        inputProps={{ step: 0.01 }}
                        value={distance}
                        onChange={handleDistanceChange}
                    />
                </Grid>

                <Grid item xs={3.3} display="flex" alignItems="center">
                    <Box className={classes.selectLabel}>大小</Box>
                    <TextField
                        fullWidth
                        size="small"
                        label="大小"
                        type="number"
                        set="any"
                        inputProps={{ step: 0.01 }}
                        value={size}
                        onChange={handleSizeChange}
                    />
                </Grid>
            </Grid>

            <Grid container spacing={4}>
                {ReportForm.map(({ name, label, options }) => {
                    const row = form.find((f) => f.key === name)
                    return (
                        <Grid item xs={6} key={name} display="flex" alignItems="center">
                            <Box mr={2} className={classes.selectLabel}>
                                {label}
                            </Box>
                            <FormControl fullWidth>
                                <InputLabel id={`select-form-${name}`}>{label}</InputLabel>
                                <Select
                                    size="small"
                                    labelId={`select-form-${name}`}
                                    label={label}
                                    value={row ? row.value : ''}
                                    onChange={(e) => handleSelectChange({ e, name })}
                                >
                                    <MenuItem value={''} sx={{ height: 35 }}></MenuItem>
                                    {options.map(({ value, label }) => (
                                        <MenuItem key={value} value={value}>
                                            {label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    )
                })}
            </Grid>
        </Box>
    )
}

export default TumorForm
