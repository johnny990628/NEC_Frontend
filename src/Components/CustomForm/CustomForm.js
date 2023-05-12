import React, { useEffect, useState } from 'react'
import { Box, Button, FormControlLabel, FormGroup, Switch } from '@mui/material'
import { useTheme } from '@mui/styles'
import { useDispatch } from 'react-redux'
import { useDebouncedCallback } from 'use-debounce'

import useStyles from './Style'

// import QRScanner from '../QRScanner/QRScanner'
import CustomInput from './CustomInput'
import { closeDialog } from '../../Redux/Slices/Dialog'
import { verifyID, verifyPhone } from '../../Utils/Verify'
import { apiCheckExists } from '../../Axios/Exists'
import { addSchedule } from '../../Redux/Slices/Schedule'
import useAlert from '../../Hooks/useAlert'
import PROCEDURECODE from './../../Assets/Json/ProcedureCode.json'

const CustomForm = ({ title, row, mode, sendData }) => {
    const [id, setId] = useState('')
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [birth, setBirth] = useState(new Date().toISOString())
    const [qrcode, setQrcode] = useState(null)
    const [errorField, setErrorField] = useState([])
    const [validID, setValidID] = useState(true)
    const [validPhone, setValidPhone] = useState(true)
    const [autoProcessSwitch, setAutoProcessSwitch] = useState(true)
    const [idUsed, setIdUsed] = useState(false)

    const classes = useStyles()
    const theme = useTheme()
    const dispatch = useDispatch()
    const showAlert = useAlert()

    useEffect(() => {
        if (row) {
            setId(row?.id)
            setName(row?.name)
            setPhone(row?.phone)
            setBirth(new Date(row.birth))
            setAutoProcessSwitch(false)
        }
    }, [])

    useEffect(() => {
        if (qrcode) {
            const { id, name, phone, department, birth } = qrcode
            setId(id)
            setName(name)
            setPhone(phone)
            setBirth(new Date(birth).toISOString())
            showAlert({ message: '掃描成功', icon: 'success' })
        }
    }, [qrcode])

    const checkExists = (data) => apiCheckExists(data).then((res) => res.data)

    const handleDelete = () => {
        setId('')
        setName('')
        setPhone('')
        setBirth(new Date().toISOString())
    }

    const handleChange = useDebouncedCallback((value, name) => {
        switch (name) {
            case 'id':
                const isValid = verifyID(value)
                setValidID(isValid)
                isValid && checkExists({ type: 'patient', value }).then((exist) => setIdUsed(exist))
                break
            case 'phone':
                setValidPhone(verifyPhone(value))
                break
            default:
                break
        }
    }, 500)

    const handleHelperText = (name) => {
        switch (name) {
            case 'id':
                return validID ? idUsed && '此號碼已存在' : '不合法的格式'
            case 'phone':
                return validPhone || '不合法的格式'
            default:
                return ''
        }
    }

    const hasEmptyField = () => {
        const errorFieldList = Object.entries({ id, name, phone, birth })
            .map(([key, value]) => !value && key)
            .filter((key) => key)
        setErrorField(errorFieldList)
        return errorFieldList.length !== 0
    }

    const handleSubmit = async (data) => {
        try {
            if (hasEmptyField() || idUsed || !validID || !validPhone) return
            //身份證字號判斷性別
            const gender = data.id.substring(1, 2) === '1' ? 'm' : 'f'
            const mr = gender === 'm' ? '先生' : '小姐'
            const { id, name } = data
            await sendData({ ...data, gender })

            if (autoProcessSwitch) {
                dispatch(
                    showAlert({
                        alertTitle: `請輸入${name}的醫令`,
                        toastTitle: '加入排程',
                        text: `${name} ${mr}`,
                        type: 'select',
                        options: PROCEDURECODE,
                        event: (text) =>
                            dispatch(
                                addSchedule({
                                    patientID: id,
                                    procedureCode: text,
                                })
                            ),
                    })
                )
            }

            if (mode === 'create') {
                showAlert({ toastTitle: '新增成功', icon: 'success' })
                handleDelete()
            }
            if (mode === 'edit') {
                dispatch(closeDialog({ type: 'patient' }))
                showAlert({
                    toastTitle: '修改成功',
                    text: `${name} ${gender === 'm' ? '先生' : '小姐'}`,
                    icon: 'success',
                })
            }
        } catch (err) {
            console.log(err)
        }
    }

    const inputModel = [
        { name: 'id', label: '身分證字號', value: id, setValue: setId, required: true },
        { name: 'name', label: '姓名', value: name, setValue: setName, required: true },
        { name: 'phone', label: '電話', value: phone, setValue: setPhone, required: true },
        { name: 'birth', label: '生日', value: birth, setValue: setBirth, required: true },
    ]

    return (
        <Box className={classes.formWrapper}>
            <Box className={classes.formHeader}>{title}</Box>
            {mode === 'create' && (
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={autoProcessSwitch}
                                onChange={(e) => setAutoProcessSwitch(e.target.checked)}
                            />
                        }
                        label={<Box sx={{ fontSize: '1.4rem' }}>自動加入排程</Box>}
                    />
                </FormGroup>
            )}

            <Box className={classes.formContainer}>
                <Box className={classes.formBody}>
                    {inputModel.map(({ name, label, value, setValue, required }) => (
                        <CustomInput
                            key={name}
                            name={name}
                            label={label}
                            value={value}
                            setValue={setValue}
                            handleChange={handleChange}
                            handleHelperText={handleHelperText}
                            error={errorField.includes(name)}
                            mode={mode}
                            required={required}
                        />
                    ))}

                    <Box sx={{ display: 'flex', width: '70%', alignItems: 'center' }}>
                        {/* {mode === 'create' && <QRScanner onResult={(res) => setQrcode(JSON.parse(res))} />} */}

                        <Button
                            variant="outlined"
                            className={classes.button}
                            sx={{
                                color: theme.palette.primary.main,

                                '&:hover': {
                                    backgroundColor: theme.palette.background.default,
                                },
                            }}
                            onClick={() => {
                                mode === 'create' && handleDelete()
                                mode === 'edit' && dispatch(closeDialog({ type: 'patient' }))
                            }}
                        >
                            {mode === 'create' ? '清除' : '取消'}
                        </Button>

                        <Button
                            variant="contained"
                            className={classes.button}
                            onClick={() =>
                                handleSubmit({
                                    id,
                                    name,
                                    phone,
                                    birth,
                                })
                            }
                        >
                            {mode === 'create' ? '新增' : '修改'}
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default CustomForm
