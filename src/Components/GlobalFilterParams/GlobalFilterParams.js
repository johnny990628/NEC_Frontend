import {
    Box,
    TextField,
    Button,
    CircularProgress,
    InputLabel,
    IconButton,
    ListItemButton,
    Select,
    Grid,
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Popover,
    Typography,
    List,
    ListItemText,
    MenuItem,
    FormControl,
} from '@mui/material'
import { Search } from '@mui/icons-material'
import { DayPicker } from 'react-day-picker'
import { zhTW } from 'date-fns/locale'
import { useState, useEffect } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import useStyles from './Style'
import SearchIcon from '@mui/icons-material/Search'
import CleaningServicesIcon from '@mui/icons-material/CleaningServices'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import CustomTableSetting from '../CustomTableForm/CustomTableSetting'

function formatDate(date) {
    const year = date.getFullYear().toString()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    return `${year}${month}${day}`
}

const GlobalFilterParams = ({ setSearch, search, totalCount, loading, filterParams, setColumns, columns }) => {
    const classes = useStyles()
    const [expand, setExpand] = useState(false)
    const [newFilterParams, setNewFilterParams] = useState(filterParams.filter((filterParam) => filterParam.preset))
    const [anchorEAdd, setAnchorEAdd] = useState(null)
    const originalData = {
        ...filterParams.reduce((obj, item) => {
            obj[item.name] = ''
            return obj
        }, {}),
        StudyDate: formatDate(new Date('2001-01-01')) + '-' + formatDate(new Date()),
    }

    const openAddIcon = Boolean(anchorEAdd)
    const openAddId = openAddIcon ? 'simple-popover' : undefined

    //filterParams to be array of objects
    const [value, setValue] = useState(originalData)

    // useEffect(() => {
    //     setSearch(value)
    // }, [])

    const handleSearch = useDebouncedCallback((text) => {
        setSearch(text)
    }, 500)

    const handleClear = () => {
        setValue(originalData)
        setSearch(originalData)
    }

    const toggleAcordion = () => {
        setExpand((prev) => !prev)
    }

    const handleClickAddIcon = (event) => {
        setAnchorEAdd(event.currentTarget)
    }

    const handleCloseAddIcon = () => {
        setAnchorEAdd(null)
    }

    return (
        <Box sx={{ margin: '1rem' }}>
            <Accordion expanded={expand} sx={{ boxShadow: 0 }}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon onClick={toggleAcordion} style={{ cursor: 'pointer' }} />}
                    aria-controls="panel1a-content"
                    style={{ cursor: 'default', backgroundColor: '#fff' }}
                >
                    <Grid container spacing={1}>
                        {filterParams
                            .filter((filterParam) => filterParam.preset)
                            .slice(0, 3)
                            .map((filterParam) => {
                                return (
                                    <RenderParams
                                        filterParam={filterParam}
                                        value={value}
                                        setValue={setValue}
                                        handleSearch={handleSearch}
                                    />
                                )
                            })}

                        <Grid item xs={12} md={6} lg={3}>
                            <Box
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    paddingRight: '10px',
                                }}
                            >
                                <Button
                                    className={classes.button}
                                    startIcon={<SearchIcon />}
                                    onClick={() => {
                                        handleSearch(value)
                                        setExpand(false)
                                    }}
                                >
                                    {loading ? <CircularProgress color="primary" size={20} /> : '搜尋'}
                                </Button>
                                <Button
                                    className={classes.button}
                                    sx={{ color: 'red.main' }}
                                    startIcon={<CleaningServicesIcon />}
                                    onClick={handleClear}
                                >
                                    清除
                                </Button>
                                <CustomTableSetting
                                    setColumns={setColumns}
                                    columns={columns}
                                    className={classes.button}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        <Grid container spacing={1}>
                            {filterParams
                                .filter((filterParam) => filterParam.preset)
                                .slice(3)
                                .map((filterParam) => {
                                    return (
                                        <RenderParams
                                            filterParam={filterParam}
                                            value={value}
                                            setValue={setValue}
                                            handleSearch={handleSearch}
                                        />
                                    )
                                })}
                        </Grid>
                    </Typography>
                </AccordionDetails>
            </Accordion>
        </Box>
    )
}

const RenderParams = ({ filterParam, value, setValue, handleSearch }) => {
    const classes = useStyles()
    const [anchorE, setAnchorE] = useState({ Start: null, End: null })

    switch (filterParam.type) {
        case 'rangeDate':
            const originalDate = value[filterParam.name].split('-')
            return (
                <>
                    {['Start', 'End'].map((item, index) => {
                        return (
                            <Grid item xs={6} md={3} lg={1.5}>
                                <TextField
                                    variant="outlined"
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
                                    id={item}
                                    anchorEl={anchorE[item]}
                                    onClose={() => setAnchorE({ ...anchorE, [item]: null })}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                    }}
                                >
                                    <Typography>
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
                                    </Typography>
                                </Popover>
                            </Grid>
                        )
                    })}
                </>
            )
        case 'text':
            return (
                <Grid item xs={12} md={6} lg={3}>
                    <TextField
                        variant="outlined"
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
        case 'select':
            return (
                <Grid item xs={12} md={6} lg={3}>
                    <FormControl className={classes.TextField}>
                        <InputLabel id="demo-simple-select-helper-label">{filterParam.label}</InputLabel>
                        <Select
                            value={value[filterParam.name]}
                            label={filterParam.label}
                            onChange={(e) => {
                                setValue({ ...value, [filterParam.name]: e.target.value })
                            }}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {filterParam.options.map((option) => (
                                <MenuItem value={option.label} key={option.value}>
                                    {option.value}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            )
        default:
            return
    }
}

export default GlobalFilterParams
