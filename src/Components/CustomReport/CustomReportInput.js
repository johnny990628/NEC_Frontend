import React, { useEffect, useState } from 'react'
import {
    Box,
    TextField,
    FormControlLabel,
    Checkbox,
    Radio,
    Select,
    MenuItem,
    ToggleButton,
    RadioGroup,
    ToggleButtonGroup,
    FormControl,
    InputLabel,
    Divider,
    Chip,
} from '@mui/material'
import { useTheme } from '@mui/styles'
import { useDispatch } from 'react-redux'
import { useDebouncedCallback } from 'use-debounce'

import useStyles from './Style'
import { addCancer, removeCancer } from '../../Redux/Slices/ReportForm'

const CustomReportInput = ({ row, input, mode }) => {
    const classes = useStyles()
    const theme = useTheme()
    const { label, name, type, options, divider } = row

    const [text, setText] = useState('')

    const dispatch = useDispatch()

    useEffect(() => {
        input ? setText(input.value) : setText('')
    }, [input])

    //debounce the input while onchange
    const handleDispatch = useDebouncedCallback(value => {
        switch (type) {
            case 'checkbox':
                Boolean(value) ? dispatch(removeCancer({ name, mode })) : dispatch(addCancer({ name, type, value: true, mode }))
                break
            case 'radio':
                input?.value.includes(value) || Boolean(!value?.length)
                    ? dispatch(removeCancer({ name, mode }))
                    : dispatch(addCancer({ name, type, value, mode }))
                break
            case 'text':
                Boolean(value) ? dispatch(addCancer({ name, type, value, mode })) : dispatch(removeCancer({ name, mode }))
                break
            case 'select':
                Boolean(value) ? dispatch(addCancer({ name, type, value, mode })) : dispatch(removeCancer({ name, mode }))
                break
            case 'select_multiple':
                dispatch(addCancer({ name, type, value, mode }))
                break
            default:
                break
        }
    }, 250)

    //處理資料變動
    const handleChange = (e, alignment) => {
        switch (type) {
            case 'checkbox':
                handleDispatch(input?.value)
                break
            case 'radio':
                handleDispatch(alignment)
                break
            case 'text':
                setText(e.target.value)
                handleDispatch(e.target.value)
                break
            case 'select':
                handleDispatch(e.target.value)
                break
            case 'select_multiple':
                handleDispatch(e.target.value)
                break
            default:
                break
        }
    }

    return (
        <Box>
            {type === 'checkbox' && (
                <>
                    {/* <ToggleButton
                    color="primary"
                    value="check"
                    selected={input?.value}
                    onChange={handleChange}
                    className={classes.toggleButton}
                    sx={{ color: input?.value && theme.palette.text.secondary }}
                >
                    <Box className={classes.inputLabel}>{label}</Box>
                </ToggleButton> */}
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={input?.value}
                                onChange={handleChange}
                                sx={{ color: input?.value && theme.palette.text.secondary, ml: 2 }}
                            />
                        }
                        label={label}
                    />
                </>
            )}
            {type === 'radio' && (
                <Box>
                    <ToggleButton
                        color="primary"
                        value="check"
                        selected={input?.value.length > 0}
                        onChange={() => {
                            dispatch(removeCancer({ name, mode }))
                        }}
                        className={classes.toggleButton}
                        sx={{ color: input?.value && theme.palette.text.secondary }}
                    >
                        <Box className={classes.inputLabel}>{label}</Box>
                    </ToggleButton>

                    <ToggleButtonGroup value={input?.value} onChange={handleChange}>
                        {options.map(option => (
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
                    </ToggleButtonGroup>
                </Box>
            )}
            {type === 'text' && (
                <TextField fullWidth label={label} variant="standard" value={text} onChange={handleChange} sx={{ width: 360, ml: 2 }} />
            )}
            {type === 'select' && (
                <FormControl variant="standard" sx={{ minWidth: 360, ml: 2 }}>
                    <InputLabel id={name}>{label}</InputLabel>
                    <Select labelId={name} value={input?.value} onChange={handleChange}>
                        <MenuItem value="" sx={{ height: 35 }}></MenuItem>
                        {options?.map(option => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )}
            {type === 'select_multiple' && (
                <FormControl variant="standard" sx={{ width: 360, ml: 2 }}>
                    <InputLabel id={name}>{label}</InputLabel>
                    <Select
                        multiple
                        labelId={name}
                        value={input?.value || []}
                        onChange={handleChange}
                        renderValue={selected => {
                            return (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map(value => (
                                        <Chip key={value} label={value} />
                                    ))}
                                </Box>
                            )
                        }}
                    >
                        {options?.map(option => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )}
            {divider && <Divider sx={{ ml: 2, mt: 4, mb: 4, width: 500 }} />}
        </Box>
    )
}

export default CustomReportInput
