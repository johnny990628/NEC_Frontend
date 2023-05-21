import react, { useState, useEffect } from 'react'
import SettingsIcon from '@mui/icons-material/Settings'
import useStyles from '../GlobalFilterParams/Style'

import { Popover, Typography, Divider, Button, Box } from '@mui/material'

import TableTransferList from './TableTransferList'

const CustomTableSetting = ({ columns, setColumns, className }) => {
    const classes = useStyles()

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
        <Box className={classes.button}>
            <Button
                aria-describedby={id}
                sx={{ width: '100%', fontSize: '1.1rem' }}
                variant="contained"
                onClick={handleClick}
                startIcon={<SettingsIcon />}
            >
                表格
            </Button>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
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
