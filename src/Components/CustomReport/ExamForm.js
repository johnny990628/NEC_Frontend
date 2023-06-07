import React, { useState, useEffect, useMemo } from 'react'
import { Box, FormControl, Grid, InputLabel, MenuItem, Select, ToggleButton, ToggleButtonGroup } from '@mui/material'
import { useTheme } from '@mui/styles'
import useStyles from './Style'
import ReportForm from '../../Assets/Json/ReportCols.json'

const ExamForm = ({}) => {
    const classes = useStyles()

    return (
        <Box>
            <Grid container spacing={4}>
                {ReportForm.map(({ name, label, type, options }) => {
                    return (
                        <Grid item xs={type !== 'radio' ? 6 : 12} key={name} display="flex" alignItems="center">
                            <Box mr={2} className={classes.selectLabel}>
                                {label}
                            </Box>
                            {type === 'select' && (
                                <FormControl fullWidth>
                                    <InputLabel id={`select-form-${name}`}>{label}</InputLabel>
                                    <Select size="small" labelId={`select-form-${name}`} label={label}>
                                        <MenuItem value={''} sx={{ height: 35 }}></MenuItem>
                                        {options.map(({ value, label }) => (
                                            <MenuItem key={value} value={value}>
                                                {label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            )}
                            {type === 'radio' && (
                                <ToggleButtonGroup>
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
                                </ToggleButtonGroup>
                            )}
                        </Grid>
                    )
                })}
            </Grid>
        </Box>
    )
}

export default ExamForm
