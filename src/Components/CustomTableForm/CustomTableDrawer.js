import * as React from 'react'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import InboxIcon from '@mui/icons-material/MoveToInbox'
import MailIcon from '@mui/icons-material/Mail'
import SettingsIcon from '@mui/icons-material/Settings'

import TableTransferList from './TableTransferList'

const CustomTableForm = () => {
    const [isOpen, setIsOpen] = React.useState(false)
    const [listItemDatas, setListItemDatas] = React.useState({
        onSelected: [1, 2, 3, 4, 5, 10],
        totalSelect: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    })

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
            <Button onClick={() => setIsOpen(true)} startIcon={<SettingsIcon />}>
                設定表格
            </Button>
            <Drawer anchor={'right'} open={isOpen} onClose={() => setIsOpen(false)}>
                <List />
            </Drawer>
        </Box>
    )
}

export default CustomTableForm
