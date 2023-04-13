import { useEffect, useRef, useState } from 'react'
import { TextField, FormControl, InputLabel, Select, MenuItem, Stack, IconButton, Button, Box } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { removePoint, updatePoint } from '../../../Redux/Slices/Breast'
import { Clear, Remove } from '@mui/icons-material'

const DynamicForm = ({ inputClock, inputDistance, inputSize, side, id, no }) => {
    const dispatch = useDispatch()
    const { CHESTMAXRADIUS, TUMORMAXSIZE } = useSelector((state) => state.breast)
    const [clock, setClock] = useState(12)
    const [size, setSize] = useState(1)
    const [distance, setDistance] = useState(0)

    useEffect(() => {
        dispatch(updatePoint({ side, id, data: { id, clock, distance: distance * 1, size: size * 1 } }))
    }, [clock, size, distance])

    useEffect(() => {
        setSize((size) => (inputSize ? inputSize : size))
        setClock((clock) => (inputClock ? inputClock : clock))
        setDistance((diatance) => (inputDistance ? inputDistance : diatance))
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

    return (
        <Stack fullWidth direction="row" spacing={2} mb={4} alignItems="end">
            <Box mr={1} sx={{ fontSize: '1rem', fontWeight: 'bold' }}>{`${no}`}</Box>
            <FormControl variant="standard">
                <InputLabel id="select-angle">方向</InputLabel>
                <Select labelId="select-angle" sx={{ minWidth: '3rem' }} value={clock} onChange={handleAngleChange}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item) => (
                        <MenuItem key={item} value={item}>
                            {item}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
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
            <IconButton color="red" onClick={handleDelete}>
                <Clear />
            </IconButton>
        </Stack>
    )
}

export default DynamicForm
