import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { apiAddBlood } from '../../Axios/Blood'
import { apiCreateReport, apiDeleteReport } from '../../Axios/Report'
import {
    apiAddSchedule,
    apiDeleteScheduleAndBloodAndReport,
    apiGetSchdules,
    apiRemoveSchedule,
} from '../../Axios/Schedule'
import { tokenExpirationHandler } from '../../Utils/ErrorHandle'
import { apiUpdateScheduleStatus } from './../../Axios/Schedule'

export const fetchSchedule = createAsyncThunk('schedule/fetchSchedule', async ({ status }, thunkAPI) => {
    try {
        const response = await apiGetSchdules({ status })
        const { results, count } = response.data

        return {
            schedules: results,
            count,
        }
    } catch (e) {
        console.log(e)
        thunkAPI.dispatch(tokenExpirationHandler(e.response))
        return thunkAPI.rejectWithValue()
    }
})

export const addSchedule = createAsyncThunk('schedule/addSchedule', async ({ patientID, procedureCode }, thunkAPI) => {
    try {
        const reportResponse = await apiCreateReport({ patientID })
        const reportID = reportResponse.data._id
        await apiAddSchedule({ patientID, reportID, procedureCode, status: 'wait-examination' })
    } catch (e) {
        thunkAPI.dispatch(tokenExpirationHandler(e.response))
        return thunkAPI.rejectWithValue()
    }
})

export const changeScheduleStatus = createAsyncThunk(
    'schedule/changeScheduleStatus',
    async ({ scheduleID, status }, thunkAPI) => {
        try {
            await apiUpdateScheduleStatus({ scheduleID, status })
        } catch (e) {
            thunkAPI.dispatch(tokenExpirationHandler(e.response))
            return thunkAPI.rejectWithValue()
        }
    }
)

export const removeSchedule = createAsyncThunk('schedule/removeSchedule', async (patientID, thunkAPI) => {
    try {
        const response = await apiDeleteScheduleAndBloodAndReport(patientID)
        return response.data
    } catch (e) {
        thunkAPI.dispatch(tokenExpirationHandler(e.response))
        return thunkAPI.rejectWithValue()
    }
})

export const removeScheduleByID = createAsyncThunk(
    'schedule/removeScheduleByID',
    async ({ reportID, scheduleID }, thunkAPI) => {
        try {
            await apiDeleteReport(reportID)
            await apiRemoveSchedule(scheduleID)
        } catch (e) {
            thunkAPI.dispatch(tokenExpirationHandler(e.response))
            return thunkAPI.rejectWithValue()
        }
    }
)

const initialState = { schedules: [], count: 0 }
const scheduleSlice = createSlice({
    name: 'schedule',
    initialState,
    extraReducers: {
        [fetchSchedule.fulfilled]: (state, action) => {
            return {
                ...action.payload,
            }
        },
        [fetchSchedule.rejected]: (state, action) => {
            return {
                ...state,
            }
        },
    },
})

export default scheduleSlice.reducer
