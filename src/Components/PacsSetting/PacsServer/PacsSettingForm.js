import React, { useEffect, useState } from 'react'
import { Box, TextField, Switch, Button } from '@mui/material'
import { apiGetPacsSettingById } from '../../../Axios/PacsSetting'
import { updatePacsSetting, fetchPacsSetting } from '../../../Redux/Slices/PacsSetting'
import useStyles from './FormStyle'
import { useDispatch } from 'react-redux'
import useAlert from '../../../Hooks/useAlert'

const PacsSettingForm = ({ editID, setEditID }) => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const showAlert = useAlert()

    const [formData, setFormData] = useState({})

    useEffect(() => {
        if (!editID) return
        const fetchData = async () => {
            const { data } = await apiGetPacsSettingById(editID)
            setFormData(data)
        }
        fetchData()
    }, [editID])

    const handleChange = (event) => {
        const { name, value } = event.target
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }))
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        dispatch(updatePacsSetting(formData))
        setEditID('')
        showAlert({
            alertTitle: '確定修改資料?',
            toastTitle: '修改成功',
            icon: 'success',
        })
    }

    return (
        <Box>
            <form onSubmit={handleSubmit}>
                <TextField
                    className={classes.TextField}
                    label="PACS URL"
                    name="pacsURL"
                    value={formData.pacsURL || ''}
                    onChange={handleChange}
                    fullWidth
                />
                <TextField
                    className={classes.TextField}
                    label="PACS Name"
                    name="pacsName"
                    value={formData.pacsName || ''}
                    onChange={handleChange}
                    fullWidth
                />
                <TextField
                    className={classes.TextField}
                    label="PACS Port"
                    name="pacsPort"
                    value={formData.pacsPort || ''}
                    onChange={handleChange}
                    fullWidth
                />
                <TextField
                    className={classes.TextField}
                    label="PACS AE Title"
                    name="pacsAETitle"
                    value={formData.pacsAETitle || ''}
                    onChange={handleChange}
                    fullWidth
                />
                <TextField
                    className={classes.TextField}
                    label="PACS WADO URI"
                    name="pacsWadoURI"
                    value={formData.pacsWadoURI || ''}
                    onChange={handleChange}
                    fullWidth
                />
                <TextField
                    className={classes.TextField}
                    label="PACS WADO Port"
                    name="pacsWadoPort"
                    value={formData.pacsWadoPort || ''}
                    onChange={handleChange}
                    fullWidth
                />
                <TextField
                    className={classes.TextField}
                    label="PACS WADO AE Title"
                    name="pacsWadoAETitle"
                    value={formData.pacsWadoAETitle || ''}
                    onChange={handleChange}
                    fullWidth
                />
                <TextField
                    className={classes.TextField}
                    label="PACS WADO URL"
                    name="pacsWadoURL"
                    value={formData.pacsWadoURL || ''}
                    onChange={handleChange}
                    fullWidth
                />
                <Button type="submit" variant="contained" color="primary">
                    Submit
                </Button>
            </form>
        </Box>
    )
}

export default PacsSettingForm
