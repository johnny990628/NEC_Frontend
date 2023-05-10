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
        <Grid container spacing={2} justifyContent="center" alignItems="center" sx={{ padding: '1em' }}>
            <Paper sx={{ width: '90%', height: 230, overflow: 'auto' }}>
                <List dense component="div" role="list">
                    {listItemDatas.totalSelect.map((value) => {
                        const labelId = `transfer-list-item-${value}-label`
                        return (
                            <ListItem
                                key={value}
                                role="listitem"
                                secondaryAction={
                                    <Checkbox
                                        edge="end"
                                        checked={listItemDatas.onSelected.indexOf(value) !== -1}
                                        onChange={() => {
                                            if (listItemDatas.onSelected.indexOf(value) !== -1) {
                                                listItemDatas.onSelected.splice(
                                                    listItemDatas.onSelected.indexOf(value),
                                                    1
                                                )
                                                setListItemDatas({ ...listItemDatas })
                                            } else {
                                                listItemDatas.onSelected.push(value)
                                                setListItemDatas({ ...listItemDatas })
                                            }
                                        }}
                                    />
                                }
                            >
                                <ListItemText id={labelId} primary={`List item ${value}`} />
                            </ListItem>
                        )
                    })}
                </List>
            </Paper>
        </Grid>
    )
}

export default TableTransferList
