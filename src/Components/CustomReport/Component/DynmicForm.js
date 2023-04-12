import { useEffect, useRef, useState } from 'react'
import { TextField, FormControl, InputLabel, Select, MenuItem, Stack, IconButton, Button, Box } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { removePoint, updatePoint } from '../../../Redux/Slices/Breast'
import { Clear, Remove } from '@mui/icons-material'

const DynamicForm = ({ x, y, inputSize, side, id, no }) => {
    const dispatch = useDispatch()
    const { report, CHESTMAXSIZE, CHESTMAXRADIUS, TUMORMAXSIZE } = useSelector((state) => state.breast)
    const [clock, setClock] = useState(12)
    const [size, setSize] = useState(1)
    const [distance, setDistance] = useState(0)

    const firstUpdate = useRef(true)
    useEffect(() => {
        if (firstUpdate.current) {
            firstUpdate.current = false
            return
        }
        const angle = (clock * 360) / 12 + 180
        const radians = (angle * Math.PI) / 180
        const x = CHESTMAXSIZE + Math.cos(radians) * distance * (CHESTMAXSIZE / CHESTMAXRADIUS)
        const y = CHESTMAXSIZE - Math.sin(radians) * distance * (CHESTMAXSIZE / CHESTMAXRADIUS)

        dispatch(updatePoint({ side, id, data: { id, x: y, y: x, size: size * 1 } }))
    }, [clock, size, distance])

    useEffect(() => {
        setSize(inputSize)
    }, [x, y, inputSize])

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
            <Box mr={2} sx={{ fontSize: '1rem', fontWeight: 'bold' }}>{`${no}`}</Box>
            <FormControl variant="standard">
                <InputLabel id="select-angle">方向</InputLabel>
                <Select labelId="select-angle" sx={{ minWidth: '4rem' }} value={clock} onChange={handleAngleChange}>
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
