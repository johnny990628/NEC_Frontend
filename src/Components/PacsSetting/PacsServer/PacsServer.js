import React, { useEffect, useState } from 'react'
import { Box, Chip, Switch, Button, Dialog, DialogTitle, DialogContent } from '@mui/material'
import { Edit, Delete } from '@mui/icons-material'
import useStyles from './Style'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { fetchPacsSetting, updatePacsSetting } from '../../../Redux/Slices/PacsSetting'
import { useDispatch, useSelector } from 'react-redux'
import PacsSettingForm from './PacsSettingForm'

const EditPacsDialog = ({ editID, setEditID }) => {
    return (
        <Dialog open={Boolean(editID)} onClose={() => setEditID('')}>
            <DialogContent>
                <PacsSettingForm editID={editID} setEditID={setEditID} />
            </DialogContent>
        </Dialog>
    )
}

const PacsServer = () => {
    const classes = useStyles()
    const dispatch = useDispatch()

    const { results: pacsList } = useSelector((state) => state.pacsSetting)
    const [editID, setEditID] = useState('')

    useEffect(() => {
        dispatch(fetchPacsSetting())
    }, [])

    const handleDelete = (_id) => {
        console.info('You clicked the delete icon.', _id)
    }

    const handleEdit = async (_id) => {
        setEditID(_id)
    }

    const handleDragEnd = (result) => {
        if (!result.destination) return

        const items = Array.from(pacsList)
        const [reorderedItem] = items.splice(result.source.index, 1)
        items.splice(result.destination.index, 0, reorderedItem)

        // setPacsList(items)
    }

    const onChangeSwitch = (_id, isOpen) => {
        dispatch(updatePacsSetting({ _id, isOpen }))
    }

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="pacsList">
                {(provided) => (
                    <Box {...provided.droppableProps} ref={provided.innerRef}>
                        <EditPacsDialog editID={editID} setEditID={setEditID} />
                        {pacsList.map((pacs, index) => (
                            <Draggable key={pacs._id} draggableId={pacs._id} index={index}>
                                {(provided) => (
                                    <Box
                                        className={classes.body}
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                    >
                                        <Switch
                                            defaultChecked={pacs.isOpen}
                                            value={pacs.isOpen}
                                            onChange={(e) => onChangeSwitch(pacs._id, e.target.checked)}
                                        />
                                        <Chip className={classes.serverName} label={pacs.pacsName} color="primary" />
                                        <Box>
                                            {pacs.pacsURL} - {pacs.pacsAETitle}
                                        </Box>
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
