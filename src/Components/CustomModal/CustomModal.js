import React from 'react'
import { Box, Button, Typography, Modal } from '@mui/material'
import useStyles from './Style'

const CustomModal = () => {
    const classes = useStyles()

    const [open, setOpen] = React.useState(false)
    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    return (
        <Box>
            <Button onClick={handleOpen}>Open modal</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box className={classes.modalBox}>
                    <Box sx={{ width: '100%' }}>adwawd</Box>
                    <Box sx={{ width: '100%' }}>
                        
                    </Box>
                </Box>
            </Modal>
        </Box>
    )
}

export default CustomModal
