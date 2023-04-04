import { createSlice } from '@reduxjs/toolkit'

const initialState = { error: {}, notification: {} }

const errorSlice = createSlice({
    name: 'error',
    initialState,
    reducers: {
        handleNotification: (state, action) => {
            return { ...state, notification: action.payload }
        },
        handleError: (state, action) => {
            return { ...state, error: action.payload }
        },
        clearError: (state, action) => {
            return initialState
        },
    },
})

export const { handleNotification, handleError, clearError } = errorSlice.actions

export default errorSlice.reducer
