import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiUpdateReport } from '../../Axios/Report'
import { apiDeleteScheduleAndBloodAndReport } from '../../Axios/Schedule'

const initialState = {
    create: [],
    edit: [],
}

export const createReport = createAsyncThunk('reportForm/createReport', async ({ patientID, reportID, data }) => {
    try {
        const response = await apiUpdateReport({ reportID, data })
        await apiDeleteScheduleAndBloodAndReport(patientID)
        return response.data
    } catch (e) {
        return e
    }
})

export const updateReport = createAsyncThunk('reportForm/updateReport', async ({ reportID, data }) => {
    try {
        const response = await apiUpdateReport({ reportID, data })
        return response.data
    } catch (e) {
        return e
    }
})

const reportFormSlice = createSlice({
    name: 'reportForm',
    initialState,
    reducers: {
        addCancer: (state, action) => {
            const { name, type, value, mode } = action.payload
            state[mode].find(s => s.name === name) //if has the same name
                ? (state[mode] = [...state[mode].filter(s => s.name !== name), { name, type, value }]) //replace the name with value
                : (state[mode] = [...state[mode], { name, type, value }]) //or add the new one
        },
        removeCancer: (state, action) => {
            const { name, mode } = action.payload
            state[mode] = state[mode].filter(c => c.name !== name)
        },
        clearCancer: (state, action) => {
            const { mode } = action.payload
            state[mode] = []
        },
        fillReport: (state, action) => {
            const { report } = action.payload
            console.log(report)
            return {
                ...state,
                edit: report,
            }
        },
        resetReport: (state, action) => {
            const { mode } = action.payload
            state[mode] = []
        },
    },
    extraReducers: {
        [createReport.fulfilled]: (state, action) => {
            return initialState
        },
        [updateReport.fulfilled]: (state, action) => {
            return initialState
        },
    },
})

export const { addCancer, removeCancer, clearCancer, fillReport, resetReport } = reportFormSlice.actions

export default reportFormSlice.reducer
