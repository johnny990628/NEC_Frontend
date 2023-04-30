import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiGetReportByReportID, apiUpdateReport } from '../../Axios/Report'
import { apiDeleteScheduleAndBloodAndReport } from '../../Axios/Schedule'
import { apiUpdateScheduleStatus } from '../../Axios/Schedule'
import { v4 } from 'uuid'

const initialState = {
    CHESTMAXSIZE: 200,
    CHESTMAXRADIUS: 6,
    TUMORMAXSIZE: 3,
    schedule: {},
    report: { L: [], R: [] },
    birads: 1,
}

export const fetchReportByReportID = createAsyncThunk('breast/fetchReportByReportID', async ({ reportID }) => {
    try {
        const response = await apiGetReportByReportID(reportID)
        const records = response.data.records
        const record = records[records.length - 1].report || []
        const birads = records[records.length - 1].birads || 1

        return { record, birads }
    } catch (e) {
        return e
    }
})

export const createReport = createAsyncThunk(
    'breast/createReport',
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

export const updateReport = createAsyncThunk('breast/updateReport', async (_, { getState }) => {
    try {
        const {
            breast: { schedule, report, birads },
            auth: {
                user: { _id: userID },
            },
        } = getState()

        const response = await apiUpdateReport({
            reportID: schedule.reportID,
            data: { report: { report, id: v4(), birads }, userID },
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

export const finishReport = createAsyncThunk('breast/finishReport', async (_, { getState }) => {
    try {
        const {
            breast: { schedule, report, birads },
            auth: {
                user: { _id: userID },
            },
        } = getState()
        const response = await apiUpdateReport({
            reportID: schedule.reportID,
            data: { report: { report, id: v4(), birads }, userID },
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

const breastSlice = createSlice({
    name: 'reportForm',
    initialState,
    reducers: {
        addPoint: (state, action) => {
            const { side, id } = action.payload
            state['report'] = {
                ...state['report'],
                [side]: [...state['report'][side], { id, clock: 12, distance: 0, size: 1 }],
            }
        },
        updatePoint: (state, action) => {
            const { side, id, data } = action.payload
            let tepAzimut = state['report'][side].map((a) => (a.id === id ? data : a))
            state['report'] = {
                ...state['report'],
                [side]: tepAzimut,
            }
        },
        removePoint: (state, action) => {
            const { side, id } = action.payload
            let tepAzimut = state['report'][side].filter((a) => a.id !== id)
            state['report'] = {
                ...state['report'],
                [side]: tepAzimut,
            }
        },
        clearPoint: (state, action) => {},
        resetReport: (state, action) => {
            return initialState
        },
        setupSchedule: (state, action) => {
            state['schedule'] = action.payload
        },
        setupReport: (state, action) => {
            state['report'] = action.payload
        },
        setupBirads: (state, action) => {
            state['birads'] = action.payload
        },
    },
    extraReducers: {
        [fetchReportByReportID.fulfilled]: (state, action) => {
            const { record, birads } = action.payload
            return { ...state, report: record, birads }
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

export const { addPoint, updatePoint, removePoint, clearPoint, setupSchedule, resetReport, setupReport, setupBirads } =
    breastSlice.actions

export default breastSlice.reducer