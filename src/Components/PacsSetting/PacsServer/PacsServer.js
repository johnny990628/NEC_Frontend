import React, { useEffect, useState } from 'react'
import { Box, Chip, Switch, Button, Dialog, DialogActions, IconButton, DialogContent } from '@mui/material'
import { Edit, Delete, Add, Close } from '@mui/icons-material'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import useStyles from './Style'

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import {
    fetchPacsSetting,
    updatePacsSetting,
    upDatePacsSettingSort,
    deletePacsSetting,
} from '../../../Redux/Slices/PacsSetting'
import { useDispatch, useSelector } from 'react-redux'
import PacsSettingForm from './PacsSettingForm'
import useAlert from '../../../Hooks/useAlert'

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
    const showAlert = useAlert()

    const { results: pacsList } = useSelector((state) => state.pacsSetting)

    const [editID, setEditID] = useState('')

    useEffect(() => {
        dispatch(fetchPacsSetting())
    }, [])

    const handleDelete = (_id) => {
        showAlert({
            alertTitle: `確定要刪除該PACS Server嗎?`,
            toastTitle: '刪除PACS',
            text: '',
            type: 'confirm',
            event: async () => {
                dispatch(deletePacsSetting({ _id }))
            },
        })
    }

    const handleEdit = async (_id) => {
        setEditID(_id)
    }

    const handleDragEnd = (result) => {
        if (!result.destination) return

        const items = Array.from(pacsList)
        const [reorderedItem] = items.splice(result.source.index, 1)
        items.splice(result.destination.index, 0, reorderedItem)
        const datas = items.map((item, index) => ({ ...item, weights: index }))
        dispatch(upDatePacsSettingSort(datas))
    }

    const onChangeSwitch = (_id, isOpen) => {
        dispatch(updatePacsSetting({ _id, isOpen }))
    }

    const handleCreate = () => {
        setEditID('create')
    }

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="pacsList">
                {(provided) => (
                    <Box {...provided.droppableProps} ref={provided.innerRef}>
                        <EditPacsDialog editID={editID} setEditID={setEditID} />
                        <Box className={classes.createPacsServer}>
                            <Button onClick={handleCreate} variant="contained" startIcon={<Add />}>
                                新增
                            </Button>
                        </Box>
                        {pacsList.map((pacs, index) => (
                            <Draggable key={pacs._id} draggableId={pacs._id} index={index}>
                                {(provided) => (
                                    <Box
                                        className={classes.body}
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                    >
                                        <DragIndicatorIcon color="disabled" />
                                        <Box className={classes.pacsOpenSwitch}>
                                            <Switch
                                                defaultChecked={pacs.isOpen}
                                                value={pacs.isOpen}
                                                onChange={(e) => onChangeSwitch(pacs._id, e.target.checked)}
                                            />
                                        </Box>
                                        <Box className={classes.pacsServerName}>
                                            <Chip
                                                label={pacs.pacsName}
                                                avatar={
                                                    <Box
                                                        style={{
                                                            width: '1.5rem',
                                                            height: '1.5rem',
                                                            borderRadius: '50%',
                                                            background: '#fff',
                                                            display: 'flex',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            color: '#000',
                                                            fontWeight: 'bold',
                                                            fontSize: '.7rem',
                                                        }}
                                                    >
                                                        {pacs.shorteningPacsName}
                                                    </Box>
                                                }
                                                color="primary"
                                            />
                                        </Box>
                                        <Box className={classes.pacsURL}>{pacs.pacsURL}</Box>
                                        <Box className={classes.pacsEvent}>
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
