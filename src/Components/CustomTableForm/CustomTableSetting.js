import react, { useState, useEffect } from 'react'
import SettingsIcon from '@mui/icons-material/Settings'

import { Popover, Typography, Divider, Button, Box } from '@mui/material'

import TableTransferList from './TableTransferList'

const CustomTableSetting = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [listItemDatas, setListItemDatas] = useState({
        onSelected: [1, 2, 3, 4, 5, 10],
        totalSelect: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    })

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
            <Box role="presentation" sx={{ width: 600, padding: '1em' }}>
                <TableTransferList listItemDatas={listItemDatas} setListItemDatas={setListItemDatas} />
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
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
            >
                <Typography sx={{ p: 2 }}>
                    <List />
                </Typography>
            </Popover>
        </Box>
    )
}

export default CustomTableSetting
