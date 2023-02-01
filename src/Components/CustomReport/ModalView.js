import React, { useState } from 'react';
import { Box, Button, IconButton, Modal } from '@mui/material';
import ChestMarker from './Component/ChestMarker';
import ClearIcon from '@mui/icons-material/Clear';

const style = {
    position: 'absolute',
    top: "50%",
    left: "50%",
    transform: 'translate(-50%, -50%)',
    width: "90%",
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const ModalView = ({ label, name, handleChange, value }) => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    
    return (
        <div>
            <Button onClick={handleOpen} variant="contained">{label}</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} >
                    <IconButton color="primary" component="label" onClick={handleClose} style={{ position: "absolute", right: "10px", top: "5px" }}>
                        <ClearIcon />
                    </IconButton>
                    {
                        name === "RADARMARK" ? <ChestMarker Modalopen={open} handleChange={handleChange} value={value} /> : null
                    }
                </Box>
            </Modal>
        </div>
    );
}

export default ModalView