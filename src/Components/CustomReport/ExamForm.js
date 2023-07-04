import React, { useState, useEffect, useMemo } from 'react'
import {
    Box,
    Chip,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
} from '@mui/material'
import { useTheme } from '@mui/styles'
import useStyles from './Style'
import ReportForm from '../../Assets/Json/ReportCols.json'
import { updateSum } from '../../Redux/Slices/Breast'
import { useDispatch, useSelector } from 'react-redux'

const ExamForm = ({}) => {
    const classes = useStyles()
    const dispatch = useDispatch()

    const { summarize } = useSelector((state) => state.breast)
    const [form, setForm] = useState([])

    useEffect(() => {
        console.log(summarize)
        setForm([...summarize])
    }, [])

    useEffect(() => {
        if (form.length > 0) dispatch(updateSum({ form }))
    }, [form])

    const handleInputChange = ({ e, name }) => {
        const value = e.target.value
        if (value.length > 0) {
            const currentCol = form.find((f) => f.key === name)
            const tmpForm = form.map((f) => (f.key === name ? { key: name, value } : f))
            setForm(currentCol ? [...tmpForm] : [...tmpForm, { key: name, value }])
        } else {
            setForm(form.filter((f) => f.key !== name))
        }
    }

    return (
        <Box>
            <Grid container spacing={4}>
                {ReportForm.map(({ name, label, type, options }) => {
                    const row = form.find((f) => f.key === name)
                    return (
                        <Grid item xs={6} key={name} display="flex" alignItems="center">
                            <Box mr={2} className={classes.selectLabel}>
                                {label}
                            </Box>
                            {type === 'select' && (
                                <FormControl size="small" fullWidth>
                                    <InputLabel id={`select-form-${name}`}>{label}</InputLabel>
                                    <Select
                                        size="small"
                                        labelId={`select-form-${name}`}
                                        label={label}
                                        value={row ? row.value : ''}
                                        onChange={(e) => handleInputChange({ e, name })}
                                    >
                                        <MenuItem value={''} sx={{ height: 35 }}></MenuItem>
                                        {options.map(({ value, label }) => (
                                            <MenuItem key={value} value={value}>
                                                {label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            )}
                            {type === 'multiple_select' && (
                                <FormControl size="small" fullWidth>
                                    <InputLabel id={`select-form-${name}`}>{`${label} (複選)`}</InputLabel>
                                    <Select
                                        size="small"
                                        labelId={`select-form-${name}`}
                                        label={`${label} (複選)`}
                                        multiple
                                        value={row ? row.value : []}
                                        onChange={(e) => handleInputChange({ e, name })}
                                        renderValue={(selected) => (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {selected.map((value) => (
                                                    <Chip key={value} label={value} />
                                                ))}
                                            </Box>
                                        )}
                                    >
                                        {options.map(({ value, label }) => {
                                            return (
                                                <MenuItem
                                                    key={value}
                                                    value={value}
                                                    sx={{
                                                        fontWeight: row
                                                            ? row.value.indexOf(value) === -1
                                                                ? 'normal'
                                                                : 'bold'
                                                            : 'normal',
                                                    }}
                                                >
                                                    {label}
                                                </MenuItem>
                                            )
                                        })}
                                    </Select>
                                </FormControl>
                            )}
                            {/* <ToggleButtonGroup>
                                    {options.map((option) => (
                                        <ToggleButton
                                            key={option.label}
                                            value={option.value}
                                            disableRipple
                                            disableFocusRipple
                                            disableElevation
                                            className={classes.optionToggleButton}
                                        >
                                            {option.label}
                                        </ToggleButton>
                                    ))}
                                </ToggleButtonGroup> */}
                            {type === 'text' && (
                                <TextField
                                    fullWidth
                                    size="small"
                                    label={name}
                                    value={row ? row.value : ''}
                                    onChange={(e) => handleInputChange({ e, name })}
                                />
                            )}
                        </Grid>
                    )
                })}
            </Grid>
        </Box>
    )
}

export default ExamForm
