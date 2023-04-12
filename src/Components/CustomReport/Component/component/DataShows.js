import { useEffect, useState } from 'react'
import { Box, Button, IconButton } from '@mui/material'
import DynamicForm from '../DynmicForm'
import { addPoint } from '../../../../Redux/Slices/Breast'
import { useDispatch, useSelector } from 'react-redux'
import { v4 } from 'uuid'
import { Add, ControlPoint } from '@mui/icons-material'

const DataShows = ({ side }) => {
    const dispatch = useDispatch()
    const { report } = useSelector((state) => state.breast)

    const handleAdd = () => {
        dispatch(addPoint({ side, id: v4() }))
    }

    return (
        <Box pr={8}>
            <Box mb={4} sx={{ fontSize: '2rem', fontWeight: 'bold' }}>
                {side}
            </Box>
            {report[side].length > 0 &&
                report[side].map(({ x, y, size, id }, index) => (
                    <DynamicForm key={id} x={x} y={y} inputSize={size} side={side} id={id} no={index + 1} />
                ))}
            <Box mt={4}>
                <Button variant="outlined" fullWidth startIcon={<Add />} onClick={handleAdd}>
                    添加
                </Button>
            </Box>
        </Box>
    )
}

export default DataShows
