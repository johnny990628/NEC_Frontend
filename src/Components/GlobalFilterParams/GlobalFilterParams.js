import { Box, TextField, Button, CircularProgress, InputAdornment, Grid, Modal, Popover } from '@mui/material'
import { Search } from '@mui/icons-material'
import { DayPicker } from 'react-day-picker'
import { zhTW } from 'date-fns/locale'
import { useState, useEffect } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import useStyles from './Style'

const GlobalFilterParams = ({ setSearch, search, totalCount, loading, filterParams }) => {
    const classes = useStyles()
    const [anchorE, setAnchorE] = useState({ Start: null, End: null })
    //filterParams to be array of objects
    const [value, setValue] = useState(
        filterParams.reduce((obj, item) => {
            obj[item.name] = ''
            return obj
        }, {})
    )

    useEffect(() => {
        setValue({ ...value, StudyDate: formatDate(new Date(0)) + '-' + formatDate(new Date()) })
    }, [])

    function removeEmpty(obj) {
        Object.keys(obj).forEach((key) => {
            if (obj[key] && typeof obj[key] === 'object') {
                removeEmpty(obj[key])
            } else if (obj[key] === undefined || obj[key] === null || obj[key] === '') {
                delete obj[key]
            }
        })
        return obj
    }

    const handleSearch = useDebouncedCallback((text) => {
        // const result = removeEmpty(text)
        setSearch(text)
    }, 500)

    function formatDate(date) {
        const year = date.getFullYear().toString()
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const day = date.getDate().toString().padStart(2, '0')
        return `${year}${month}${day}`
    }

    console.log(value)

    return (
        <Box sx={{ display: 'flex', justifyContent: 'left', alignItems: 'center', margin: '1rem' }}>
            <Box>
                {filterParams.map((filterParam) => {
                    switch (filterParam.type) {
                        case 'date':
                            const originalDate = value[filterParam.name].split('-')
                            return (
                                <Box className={classes.DateBox} sx={{ display: 'flex' }}>
                                    {['Start', 'End'].map((item, index) => {
                                        return (
                                            <>
                                                <TextField
                                                    variant="standard"
                                                    label={item + ' ' + filterParam.label}
                                                    value={originalDate[index]}
                                                    className={classes.TextFieldDate}
                                                    InputProps={{
                                                        style: {
                                                            fontSize: '1.3rem',
                                                        },
                                                        readOnly: true,
                                                    }}
                                                    onClick={(e) => setAnchorE({ ...anchorE, [item]: e.currentTarget })}
                                                />
                                                <Popover
                                                    open={Boolean(anchorE[item])}
                                                    anchorEl={anchorE[item]}
                                                    onClose={() => setAnchorE({ ...anchorE, [item]: null })}
                                                    anchorOrigin={{
                                                        vertical: 'bottom',
                                                        horizontal: 'left',
                                                    }}
                                                >
                                                    <DayPicker
                                                        mode="single"
                                                        onDayClick={(date) => {
                                                            const newDate = originalDate
                                                            newDate[index] = formatDate(date)
                                                            setValue({
                                                                ...value,
                                                                [filterParam.name]: newDate.join('-'),
                                                            })
                                                            setAnchorE({ ...anchorE, [item]: null })
                                                        }}
                                                        fromYear={1930}
                                                        toYear={new Date().getFullYear()}
                                                        captionLayout="dropdown"
                                                        locale={zhTW}
                                                    />
                                                </Popover>
                                            </>
                                        )
                                    })}
                                </Box>
                            )
                        case 'text':
                            return (
                                <TextField
                                    variant="standard"
                                    label={filterParam.label}
                                    value={value[filterParam]}
                                    key={filterParam.name}
                                    className={classes.TextField}
                                    onChange={(e) => {
                                        setValue({ ...value, [filterParam.name]: e.target.value })
                                    }}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            handleSearch(value)
                                        }
                                    }}
                                />
                            )
                    }
                })}
            </Box>
            <Box style={{ marginLeft: '1rem' }}>
                {loading ? <CircularProgress color="primary" size={20} /> : <Box style={{ width: '20px' }}></Box>}
            </Box>
        </Box>
    )
}

export default GlobalFilterParams
