import { Box, Dialog, DialogContent, InputAdornment, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material'
import React, { useState } from 'react'
import { DayPicker } from 'react-day-picker'
import { zhTW } from 'date-fns/locale'
import { addDays, format, isValid, parseISO } from 'date-fns'
import { AccessTime } from '@mui/icons-material'

const DateRanger = ({ setDateRange }) => {
    const [dialogOpen, setDialogOpen] = useState(false)
    const [mode, setMode] = useState('all')
    const [date, setDate] = useState(new Date())

    const handleModeChange = (e) => {
        setMode(e.target.value)
        setDate(new Date())
        if (e.target.value === 'all') {
            setDateRange({ from: parseISO('1900-01-01'), to: addDays(new Date(), 1) })
        }
    }

    const handleDateSelect = (range) => {
        setDate(range)
        isValid(range)
            ? setDateRange({ from: range, to: addDays(range, 1) })
            : setDateRange(date?.to ? range : { from: range?.from, to: addDays(range?.from, 2) })
    }

    const formatDate = () => {
        return isValid(date)
            ? date.toLocaleDateString()
            : `${isValid(date?.from) ? format(date?.from, 'y-MM-dd') : ''} to ${
                  isValid(date?.to) ? format(date?.to, 'y-MM-dd') : ''
              }`
    }

    return (
        <Box>
            <Box display="flex" alignItems="center">
                <ToggleButtonGroup color="primary" value={mode} onChange={handleModeChange} sx={{ mr: 2 }}>
                    <ToggleButton value="all" key="all">
                        全部
                    </ToggleButton>
                    <ToggleButton value="single" key="single">
                        單日
                    </ToggleButton>
                    <ToggleButton value="range" key="range">
                        範圍
                    </ToggleButton>
                </ToggleButtonGroup>
                {mode !== 'all' && (
                    <TextField
                        variant="outlined"
                        size="small"
                        placeholder="請選擇日期"
                        value={formatDate()}
                        sx={{ minWidth: 260, mr: 2 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <AccessTime />
                                </InputAdornment>
                            ),
                        }}
                        onClick={() => setDialogOpen(true)}
                    >
                        選擇日期
                    </TextField>
                )}
            </Box>
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogContent>
                    <DayPicker
                        mode={mode}
                        selected={date}
                        onSelect={handleDateSelect}
                        fromYear={1930}
                        toYear={new Date().getFullYear()}
                        captionLayout="dropdown"
                        locale={zhTW}
                        footer={
                            <TextField
                                fullWidth
                                size="small"
                                value={formatDate()}
                                sx={{ mt: 2 }}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        }
                    />
                </DialogContent>
            </Dialog>
        </Box>
    )
}

export default DateRanger
