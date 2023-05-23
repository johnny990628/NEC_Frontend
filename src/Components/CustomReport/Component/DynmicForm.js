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
import ReportForm from '../../../Assets/Json/ReportForm.json'

const DynamicForm = ({ inputClock, inputDistance, inputSize, side, id, no, inputForm }) => {
    const dispatch = useDispatch()
    const { CHESTMAXRADIUS, TUMORMAXSIZE } = useSelector((state) => state.breast)
    const [clock, setClock] = useState(12)
    const [size, setSize] = useState(1)
    const [form, setForm] = useState([])
    const [distance, setDistance] = useState(0)
    const [anchorEl, setAnchorEl] = useState(null)

    useEffect(() => {
        dispatch(updatePoint({ side, id, data: { id, clock, distance: distance * 1, size: size * 1, form } }))
    }, [clock, size, distance, form])

    console.log(form)

    useEffect(() => {
        setSize((size) => (inputSize ? inputSize : size))
        setClock((clock) => (inputClock ? inputClock : clock))
        setDistance((diatance) => (inputDistance ? inputDistance : diatance))
        setForm((form) => (inputForm ? inputForm : form))
    }, [])

    const handleDelete = () => {
        dispatch(removePoint({ side, id }))
    }

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

    const handleAdd = (e) => {
        setAnchorEl(e.currentTarget)
    }

    const handleAddFormList = (item) => {
        setForm([...form, { key: item.name, value: '' }])
    }

    return (
        <Grid mb={4} container spacing={1}>
            <Grid xs={1} md={1} lg={1}>
                <Box sx={{ fontSize: '1rem', fontWeight: 'bold' }}>{`${no}`}</Box>
            </Grid>
            <Grid xs={11} md={11} lg={11}>
                <Stack direction="row" spacing={2} mb={'1rem'} alignItems="end">
                    <TextField
                        variant="standard"
                        label="大小"
                        type="number"
                        set="any"
                        inputProps={{ step: 0.01 }}
                        value={size}
                        onChange={handleSizeChange}
                    />
                    <TextField
                        variant="standard"
                        label="距離"
                        type="number"
                        set="any"
                        inputProps={{ step: 0.01 }}
                        value={distance}
                        onChange={handleDistanceChange}
                    />
                    <FormControl variant="standard">
                        <InputLabel id="select-angle">方向</InputLabel>
                        <Select
                            labelId="select-angle"
                            sx={{ minWidth: '3rem' }}
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
                    <IconButton color="green" onClick={handleAdd}>
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
                    </IconButton>
                </Stack>

                <Grid container spacing={1}>
                    {form.map((item) => (
                        <Grid item xs={6} md={4} lg={3} key={item.key} sx={{ display: 'flex' }}>
                            <FormControl variant="standard" fullWidth>
                                <InputLabel id="select-angle">{item.key}</InputLabel>
                                <Select
                                    labelId="select-angle"
                                    value={item.value}
                                    sx={{ width: '90%' }}
                                    onChange={(e) => {
                                        const newForm = form.map((f) => {
                                            if (f.key === item.key) {
                                                return { key: f.key, value: e.target.value }
                                            } else {
                                                return f
                                            }
                                        })
                                        setForm(newForm)
                                    }}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            {item.value && (
                                                <IconButton
                                                    edge="end"
                                                    sx={{
                                                        marginRight: '-1rem',
                                                        color: 'red',
                                                        padding: '0',
                                                        width: '1rem',
                                                        height: '1rem',
                                                    }}
                                                    onClick={() => {
                                                        setForm(form.filter((f) => f.key !== item.key))
                                                    }}
                                                >
                                                    <Clear fontSize="small" />
                                                </IconButton>
                                            )}
                                        </InputAdornment>
                                    }
                                >
                                    {ReportForm.filter((Rf) => Rf.name === item.key)[0].options.map((RfItem) => (
                                        <MenuItem key={RfItem} value={RfItem}>
                                            {RfItem}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    ))}
                </Grid>
            </Grid>
        </Grid>
    )
}

export default DynamicForm
