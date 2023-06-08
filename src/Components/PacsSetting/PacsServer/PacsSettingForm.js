import React, { useEffect, useState } from 'react'
import { Box, TextField, Switch, Button } from '@mui/material'
import { apiGetPacsSettingById } from '../../../Axios/PacsSetting'
import { updatePacsSetting, fetchPacsSetting } from '../../../Redux/Slices/PacsSetting'
import useStyles from './FormStyle'
import { useDispatch } from 'react-redux'
import useAlert from '../../../Hooks/useAlert'
import { apiTestPacsSetting } from '../../../Axios/PacsSetting'

const PacsSettingForm = ({ editID, setEditID }) => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const showAlert = useAlert()

    const [formData, setFormData] = useState({})
    const [isTest, setIsTest] = useState(false)

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
        setIsTest(false)
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

    const handleTest = async () => {
        const response = await apiTestPacsSetting({ pacsURL: formData.pacsURL, wadoURL: formData.pacsWadoURL })
        if (response.status === 200) {
            showAlert({
                alertTitle: '連線成功',
                toastTitle: '連線成功',
                icon: 'success',
            })
            setIsTest(true)
        }
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
                <Box className={classes.eventButtonBox}>
                    <Button className={classes.Button} onClick={handleTest} variant="contained" color="primary">
                        測試連線
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color="contrast"
                        className={classes.Button}
                        disabled={!isTest}
                    >
                        完成設定
                    </Button>
                </Box>
            </form>
        </Box>
    )
}

export default PacsSettingForm
