import React, { useState } from 'react'
import { Box, Chip, Switch, Button } from '@mui/material'
import { Edit, Delete } from '@mui/icons-material'
import useStyles from './Style'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

const TestPacsList = [
    { _id: 'dawdawdx12414srf315rw$%ad1', name: 'Raccoon', URL: 'http://localhost:8042', isOpen: true },
    { _id: 'dawd412rf135TQ#%qsfaegesfa', name: 'DCM4CHEE', URL: 'http://localhost:8042', isOpen: false },
]

const PacsServer = () => {
    const classes = useStyles()
    const [pacsList, setPacsList] = useState(TestPacsList)

    const handleDelete = (_id) => {
        console.info('You clicked the delete icon.', _id)
    }

    const handleEdit = (_id) => {
        console.info('You clicked the edit icon.', _id)
    }

    const handleDragEnd = (result) => {
        if (!result.destination) return

        const items = Array.from(pacsList)
        const [reorderedItem] = items.splice(result.source.index, 1)
        items.splice(result.destination.index, 0, reorderedItem)

        setPacsList(items)
    }

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="pacsList">
                {(provided) => (
                    <Box {...provided.droppableProps} ref={provided.innerRef}>
                        {pacsList.map((pacs, index) => (
                            <Draggable key={pacs._id} draggableId={pacs._id} index={index}>
                                {(provided) => (
                                    <Box
                                        className={classes.body}
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                    >
                                        <Switch defaultChecked={pacs.isOpen} />
                                        <Chip className={classes.serverName} label={pacs.name} color="primary" />
                                        <Box>{pacs.URL}</Box>
                                        <Box>
                                            <Button
                                                startIcon={<Edit color="primary" />}
                                                sx={{ fontSize: '1.1rem' }}
                                                onClick={() => handleEdit(pacs._id)}
                                            >
                                                編輯
                                            </Button>
                                            <Button
                                                startIcon={<Delete />}
                                                sx={{ color: 'red.main', fontSize: '1.1rem' }}
                                                onClick={() => handleDelete(pacs._id)}
                                            >
                                                刪除
                                            </Button>
                                        </Box>
                                    </Box>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </Box>
                )}
            </Droppable>
        </DragDropContext>
    )
}

export default PacsServer
