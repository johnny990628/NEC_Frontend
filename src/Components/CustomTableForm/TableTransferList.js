import React, { useState, useEffect } from 'react'
import Grid from '@mui/material/Grid'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import { Box, IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

const TableTransferList = ({ listItemDatas, setListItemDatas }) => {
    return (
        <Paper sx={{ height: 230, overflow: 'auto', width: '100%' }}>
            <List dense component="div" role="list">
                {listItemDatas.map((value, index) => {
                    const labelId = `transfer-list-item-${value.accessor}-label`
                    return (
                        <ListItem
                            key={value.accessor}
                            role="listitem"
                            secondaryAction={
                                <Checkbox
                                    edge="end"
                                    checked={value.showInCustomTable}
                                    onChange={() => {
                                        const originalDatas = [...listItemDatas]
                                        originalDatas[index].showInCustomTable = !originalDatas[index].showInCustomTable
                                        setListItemDatas(originalDatas)
                                    }}
                                />
                            }
                        >
                            <ListItemText id={labelId} primary={`List item ${value.Header}`} />
                        </ListItem>
                    )
                })}
            </List>
        </Paper>
    )
}

export default TableTransferList
