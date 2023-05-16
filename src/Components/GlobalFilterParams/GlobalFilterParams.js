import { Box, TextField, Button, CircularProgress, InputAdornment, Grid, Modal, Popover } from '@mui/material'
import { Search } from '@mui/icons-material'
import { DayPicker } from 'react-day-picker'
import { zhTW } from 'date-fns/locale'
import { useState, useEffect } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import useStyles from './Style'
import SearchIcon from '@mui/icons-material/Search'
import CleaningServicesIcon from '@mui/icons-material/CleaningServices'

const GlobalFilterParams = ({ setSearch, search, totalCount, loading, filterParams }) => {
    const classes = useStyles()
    const [anchorE, setAnchorE] = useState({ Start: null, End: null })

    const originalData = {
        ...filterParams.reduce((obj, item) => {
            obj[item.name] = ''
            return obj
        }, {}),
        StudyDate: formatDate(new Date('2001-01-01')) + '-' + formatDate(new Date()),
    }

    //filterParams to be array of objects
    const [value, setValue] = useState(originalData)

    useEffect(() => {
        setSearch(value)
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
        //const result = removeEmpty(text)
        setSearch(text)
    }, 500)

    function formatDate(date) {
        const year = date.getFullYear().toString()
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const day = date.getDate().toString().padStart(2, '0')
        return `${year}${month}${day}`
    }

    function formatDate2(inputDate) {
        var year = inputDate.substring(0, 4)
        var month = inputDate.substring(4, 6)
        var day = inputDate.substring(6, 8)
        return year + '-' + month + '-' + day
    }

    const handleClear = () => {
        setValue(originalData)
        console.log(value)
        setSearch(originalData)
    }

    return (
        <Box sx={{ margin: '1rem' }}>
            <Grid container spacing={2}>
                {filterParams.map((filterParam) => {
                    switch (filterParam.type) {
                        case 'rangeDate':
                            const originalDate = value[filterParam.name].split('-')
                            return (
                                <>
                                    {['Start', 'End'].map((item, index) => {
                                        return (
                                            <Grid item xs={12} md={6} lg={2}>
                                                <TextField
                                                    variant="standard"
                                                    label={item + ' ' + filterParam.label}
                                                    value={originalDate[index]}
                                                    className={classes.TextFieldDate}
                                                    InputProps={{
                                                        style: {
                                                            fontSize: '1rem',
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
                                                        selected={new Date()}
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
                                            </Grid>
                                        )
                                    })}
                                </>
                            )
                        case 'text':
                            return (
                                <Grid item xs={12} md={6} lg={4}>
                                    <TextField
                                        variant="standard"
                                        label={filterParam.label}
                                        value={value[filterParam.name]}
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
                                </Grid>
                            )
                    }
                })}
                <Grid item xs={6} md={6} lg={2}>
                    <Button
                        className={classes.button}
                        sx={{ fontSize: '1.1rem' }}
                        startIcon={<SearchIcon />}
                        onClick={() => handleSearch(value)}
                    >
                        搜尋
                    </Button>
                </Grid>
                <Grid item xs={6} md={6} lg={2}>
                    <Button
                        className={classes.button}
                        sx={{ color: 'red.main', fontSize: '1.1rem' }}
                        startIcon={<CleaningServicesIcon />}
                        onClick={handleClear}
                    >
                        清除
                    </Button>
                </Grid>
                <Grid item xs={1} md={1} lg={1}>
                    {loading ? <CircularProgress color="primary" size={20} /> : <Box style={{ width: '20px' }}></Box>}
                </Grid>
            </Grid>
        </Box>
    )
}

export default GlobalFilterParams
