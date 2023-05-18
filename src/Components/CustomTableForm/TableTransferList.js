import React, { useState, useEffect } from 'react'
import { Paper, ListItem, List, ListItemText, Checkbox } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

const TableTransferList = ({ listItemDatas, setListItemDatas }) => {
    return (
        <Paper sx={{ overflow: 'auto', width: '100%' }}>
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
                                    onClick={() => {
                                        const originalDatas = [...listItemDatas]
                                        originalDatas[index].showInCustomTable = !originalDatas[index].showInCustomTable
                                        setListItemDatas(originalDatas)
                                    }}
                                />
                            }
                        >
                            <ListItemText id={labelId} primary={value.Header} />
                        </ListItem>
                    )
                })}
            </List>
        </Paper>
    )
}

export default TableTransferList
