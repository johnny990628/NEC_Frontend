import React, { useEffect, useState } from 'react'
import { Box, TextField, IconButton, Button } from '@mui/material'
import { apiGetPacsSettingById } from '../../../Axios/PacsSetting'
import { updatePacsSetting, fetchPacsSetting, createPacsSetting } from '../../../Redux/Slices/PacsSetting'
import useStyles from './FormStyle'
import { useDispatch, useSelector } from 'react-redux'
import useAlert from '../../../Hooks/useAlert'
import { apiTestPacsSetting } from '../../../Axios/PacsSetting'
import { Close } from '@mui/icons-material'

const PacsSettingForm = ({ editID, setEditID }) => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const showAlert = useAlert()
    const rexuxPacsList = useSelector((state) => state.pacsSetting.results)
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

        if (editID === 'create') {
            dispatch(createPacsSetting({ ...formData, weights: rexuxPacsList.length, isOpen: true }))
            showAlert(ALERT_CREATE_SUCCESS)
        } else {
            dispatch(updatePacsSetting(formData))
            showAlert(ALERT_UPDATE_SUCCESS)
        }
        setEditID('')
    }

    const ALERT_CREATE_SUCCESS = {
        alertTitle: '新增成功',
        toastTitle: '新增成功',
        icon: 'success',
    }

    const ALERT_UPDATE_SUCCESS = {
        alertTitle: '確定修改資料?',
        toastTitle: '修改成功',
        icon: 'success',
    }

    const ALERT_TEST_SUCCESS = {
        alertTitle: '連線成功',
        toastTitle: '連線成功',
        icon: 'success',
    }

    const ALERT_TEST_FAILURE = {
        alertTitle: '連線失敗',
        toastTitle: '連線失敗',
        icon: 'error',
    }

    const handleTest = async () => {
        try {
            const response = await apiTestPacsSetting({ pacsURL: formData.pacsURL, wadoURL: formData.pacsWadoURL })
                .then((res) => {
                    showAlert(ALERT_TEST_SUCCESS)
                    setIsTest(true)
                })
                .catch((err) => {
                    showAlert(ALERT_TEST_FAILURE)
                    setIsTest(false)
                })
        } catch (error) {
            return error.response
        }
    }

    return (
        <Box>
            <form onSubmit={handleSubmit}>
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
                    label="PACS 簡稱"
                    name="shorteningPacsName"
                    value={formData.shorteningPacsName || ''}
                    onChange={handleChange}
                    fullWidth
                />
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
                    label="PACS WADO URL"
                    name="pacsWadoURL"
                    value={formData.pacsWadoURL || ''}
                    onChange={handleChange}
                    fullWidth
                />
                <Box className={classes.eventButtonBox}>
                    <Button
                        className={classes.Button}
                        startIcon={<Close />}
                        onClick={() => setEditID('')}
                        sx={{ color: 'red.main', fontSize: '1.1rem' }}
                    >
                        取消
                    </Button>
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
