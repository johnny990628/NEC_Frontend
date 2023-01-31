import React, { useEffect, useState, useRef } from 'react';
import { Box, Button, Typography, Modal } from '@mui/material';
import ChestMarker from './Component/ChestMarker';

const style = {
    position: 'absolute',
    top: "50%",
    left: "50%",
    transform: 'translate(-50%, -50%)',
    width: "70%",
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const ModalView = ({ label, name }) => {
    const [open, setOpen] = React.useState(false);
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
                    {
                        name === "RADARMARK" ? <ChestMarker /> : null
                    }
                </Box>
            </Modal>
        </div>
    );
}

export default ModalView