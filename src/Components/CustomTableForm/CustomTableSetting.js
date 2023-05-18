import react, { useState, useEffect } from 'react'
import SettingsIcon from '@mui/icons-material/Settings'

import { Popover, Typography, Divider, Button, Box } from '@mui/material'

import TableTransferList from './TableTransferList'

const CustomTableSetting = ({ columns, setColumns }) => {
    const [anchorEl, setAnchorEl] = useState(null)

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const open = Boolean(anchorEl)
    const id = open ? 'simple-popover' : undefined

    const List = () => {
        return (
            <Box role="presentation" sx={{ width: 400 }}>
                <TableTransferList listItemDatas={columns} setListItemDatas={setColumns} />
                <Divider />
            </Box>
        )
    }

    return (
        <Box sx={{ marginRight: '1em', marginLeft: 'auto', marginBottom: '1em' }}>
            <Button aria-describedby={id} variant="contained" onClick={handleClick} startIcon={<SettingsIcon />}>
                設定表格
            </Button>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
            >
                <Typography>
                    <List />
                </Typography>
            </Popover>
        </Box>
    )
}

export default CustomTableSetting
