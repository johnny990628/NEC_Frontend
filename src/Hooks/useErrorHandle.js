import { useEffect, useState } from 'react'
import useAlert from './useAlert'
import { logout } from '../Redux/Slices/Auth'
import { useDispatch, useSelector } from 'react-redux'
import { clearError } from '../Redux/Slices/Error'

const useErrorHandle = () => {
    const showAlert = useAlert()
    const dispatch = useDispatch()
    const { error, notification } = useSelector((state) => state.error)

    useEffect(() => {
        if (error) {
            if (error.status === 403) dispatch(logout(true))
            else
                showAlert({
                    toastTitle: error?.statusText,
                    text: error?.data?.message,
                    icon: 'error',
                })
        }
    }, [error])
    useEffect(() => {
        if (notification) {
            showAlert({
                toastTitle: notification.title,
                text: notification.text,
                icon: 'success',
            })
        }
    }, [notification])
}

export default useErrorHandle
