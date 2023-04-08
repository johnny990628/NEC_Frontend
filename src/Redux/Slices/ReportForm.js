import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiGetReportByReportID, apiUpdateReport } from '../../Axios/Report'
import { apiDeleteScheduleAndBloodAndReport } from '../../Axios/Schedule'
import { apiUpdateScheduleStatus } from './../../Axios/Schedule'
import { v4 } from 'uuid'

const initialState = {
    schedule: {},
    report: [],
}

export const fetchReportByReportID = createAsyncThunk('reportForm/fetchReportByReportID', async ({ reportID }) => {
    try {
        const response = await apiGetReportByReportID(reportID)
        const records = response.data.records
        const record = records[records.length - 1].report || []

        return record
    } catch (e) {
        return e
    }
})

export const createReport = createAsyncThunk(
    'reportForm/createReport',
    async ({ patientID, scheduleID, reportID, data }) => {
        try {
            const response = await apiUpdateReport({ reportID, data })
            // await apiDeleteScheduleAndBloodAndReport(patientID)
            await apiUpdateScheduleStatus({ patientID, scheduleID, status: 'finish' })
            return response.data
        } catch (e) {
            return e
        }
    }
)

export const updateReport = createAsyncThunk('reportForm/updateReport', async (_, { getState }) => {
    try {
        const {
            reportForm: { schedule, report },
            auth: {
                user: { _id: userID },
            },
        } = getState()

        const response = await apiUpdateReport({
            reportID: schedule.reportID,
            data: { report: { report, id: v4() }, userID },
        })
        schedule.status === 'finish'
            ? await apiUpdateScheduleStatus({
                  patientID: schedule.patientID,
                  scheduleID: schedule._id,
                  status: 'finish',
              })
            : await apiUpdateScheduleStatus({
                  patientID: schedule.patientID,
                  scheduleID: schedule._id,
                  status: 'wait-finish',
              })
        return response.data
    } catch (e) {
        return e
    }
})

export const finishReport = createAsyncThunk('reportForm/finishReport', async (_, { getState }) => {
    try {
        const {
            reportForm: { schedule, report },
            auth: {
                user: { _id: userID },
            },
        } = getState()
        const response = await apiUpdateReport({
            reportID: schedule.reportID,
            data: { report: { report, id: v4() }, userID },
        })
        await apiUpdateScheduleStatus({
            patientID: schedule.patientID,
            scheduleID: schedule._id,
            status: 'finish',
        })
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
            state['report'].find((s) => s.name === name) //if has the same name
                ? (state['report'] = [...state['report'].filter((s) => s.name !== name), { name, type, value }]) //replace the name with value
                : (state['report'] = [...state['report'], { name, type, value }]) //or add the new one
        },
        removeCancer: (state, action) => {
            const { name, mode } = action.payload
            state['report'] = state['report'].filter((c) => c.name !== name)
        },
        clearCancer: (state, action) => {
            const { mode } = action.payload
            state['report'] = []
        },
        resetReport: (state, action) => {
            return initialState
        },
        setupSchedule: (state, action) => {
            state['schedule'] = action.payload
        },
        setupReport: (state, action) => {
            state['report'] = action.payload
        },
    },
    extraReducers: {
        [fetchReportByReportID.fulfilled]: (state, action) => {
            return { ...state, report: action.payload }
        },
        [createReport.fulfilled]: (state, action) => {
            return initialState
        },
        [updateReport.fulfilled]: (state, action) => {
            return initialState
        },
        [finishReport.fulfilled]: (state, action) => {
            return initialState
        },
    },
})

export const { addCancer, removeCancer, clearCancer, setupSchedule, setupReport, fillReport, resetReport } =
    reportFormSlice.actions

export default reportFormSlice.reducer
