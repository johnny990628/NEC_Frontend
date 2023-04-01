import { Box, TextField, Button, CircularProgress } from '@mui/material'
import { Search } from '@mui/icons-material'
import { useState } from 'react'

import useStyles from './Style'

const GlobalFilter = ({ setSearch, search, totalCount, loading }) => {
    const classes = useStyles()
    const [value, setValue] = useState('')

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '1rem' }}>
            <Search sx={{ mr: 1, color: 'primary.light_secondary' }} />
            <TextField
                variant="standard"
                value={value}
                onChange={(e) => {
                    setValue(e.target.value)
                }}
                onKeyPress={(e) => {
                    e.key === 'Enter' && setSearch(value)
                }}
                placeholder={`${search && `${search}...`}${totalCount}筆資料`}
                sx={{
                    marginRight: '1rem',
                }}
            />
            <Button
                onClick={() => {
                    setSearch(value)
                }}
                sx={{ fontSize: '1.1rem ', padding: '.1rem', marginRight: '.5rem' }}
                className={classes.button}
            >
                搜尋
            </Button>
            <Button
                onClick={() => {
                    setValue('')
                    setSearch('')
                }}
                sx={{ fontSize: '1.1rem ', padding: '.1rem', color: 'contrast.main' }}
                className={classes.button}
            >
                清除
            </Button>
            <Box style={{ marginLeft: '1rem' }}>
                {loading ? <CircularProgress color="primary" size={20} /> : <Box style={{ width: '20px' }}></Box>}
            </Box>
        </Box>
    )
}

export default GlobalFilter
