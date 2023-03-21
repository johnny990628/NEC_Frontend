import React, { useState } from 'react'
import { Box, Button, IconButton, Modal } from '@mui/material'
import ChestMarker from './Component/ChestMarker'
import ClearIcon from '@mui/icons-material/Clear'

const style = {
  position: 'relative',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
}

const ModalView = ({ label, name, handleChange, value }) => {
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  //控制儲存與取消，當次使用者輸入存放於tempValue
  const [tempValue, setTempValue] = useState(value)
  const handleSave = () => {
    handleChange(tempValue)
    handleClose()
  }

  return (
    <div>
      <Button onClick={handleOpen} variant="contained">
        {label}
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {name === 'RADARMARK' ? <ChestMarker Modalopen={open} handleChange={setTempValue} value={value} /> : null}

          <div style={{ position: 'absolute', bottom: '10px', right: '20px' }}>
            <Button color="primary" variant="contained" component="label" onClick={handleSave}>
              儲存
            </Button>
            <Button color="error" component="label" onClick={handleClose}>
              取消
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  )
}

export default ModalView
