import { useEffect, useRef, useState } from 'react'
import {
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Stack,
    IconButton,
    InputAdornment,
    Box,
    Popover,
    MenuList,
    Grid,
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { removePoint, updatePoint } from '../../../Redux/Slices/Breast'
import { Clear, Remove, Add } from '@mui/icons-material'
import ReportForm from '../../../Assets/Json/ReportCols2.json'
import useStyles from '../Style'

const DynamicForm = ({ side, label, id }) => {
    const dispatch = useDispatch()
    const classes = useStyles()
    const { report, CHESTMAXRADIUS, TUMORMAXSIZE } = useSelector((state) => state.breast)
    const [clock, setClock] = useState(12)
    const [size, setSize] = useState(1)
    const [form, setForm] = useState([])
    const [distance, setDistance] = useState(0)
    const [anchorEl, setAnchorEl] = useState(null)

    useEffect(() => {
        const inputForm = report[side].find((r) => r.id === id)
        setSize((size) => (inputForm.size ? inputForm.size : size))
        setClock((clock) => (inputForm.clock ? inputForm.clock : clock))
        setDistance((diatance) => (inputForm.diatance ? inputForm.diatance : diatance))
        setForm((form) => (inputForm.form ? inputForm.form : form))
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

    return (
        <Box>
            <Grid container mb={6} sx={{ width: '100%' }} spacing={4}>
                <Grid item xs={2}>
                    <Box sx={{ fontSize: '2rem', fontWeight: 'bold' }}>{label}</Box>
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
                {ReportForm.map(({ name, label, options }) => (
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
                                value={form.find((f) => f.value === name)?.value}
                                onChange={(e) => {
                                    setForm([...form, { key: name, value: e.target.value }])
                                }}
                            >
                                {options.map(({ value, label }) => (
                                    <MenuItem key={value} value={value}>
                                        {label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                ))}
                {/* <IconButton color="green" onClick={handleAdd}>
                        <Add />
                    </IconButton>
                    <Popover
                        open={Boolean(anchorEl)}
                        anchorEl={anchorEl}
                        onClose={() => setAnchorEl(null)}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                    >
                        <MenuList>
                            {ReportForm.filter((Rf) => {
                                const filterForm = form.filter((f) => f.key === Rf.name)
                                return filterForm.length === 0
                            }).map((item) => (
                                <MenuItem
                                    sx={{ p: '.5rem 1rem' }}
                                    key={item.name}
                                    onClick={() => handleAddFormList(item)}
                                >
                                    {item.label}
                                </MenuItem>
                            ))}
                        </MenuList>
                    </Popover>
                    <IconButton color="red" onClick={handleDelete}>
                        <Clear />
                    </IconButton> */}
            </Grid>
        </Box>
    )
}

export default DynamicForm
