import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { apiAddBlood } from '../../Axios/Blood'
import { apiCreateReport, apiDeleteReport } from '../../Axios/Report'
import {
    apiAddSchedule,
    apiDeleteScheduleAndBloodAndReport,
    apiGetSchdules,
    apiRemoveSchedule,
} from '../../Axios/Schedule'
import { apiUpdateScheduleStatus } from './../../Axios/Schedule'

import { handleError } from './Error'

export const fetchSchedule = createAsyncThunk('schedule/fetchSchedule', async (params, thunkAPI) => {
    try {
        const response = await apiGetSchdules(params)
        const { results, count } = response.data

        return {
            schedules: results,
            count,
        }
    } catch (e) {
        thunkAPI.dispatch(handleError(e.response))
        return thunkAPI.rejectWithValue()
    }
})

export const addSchedule = createAsyncThunk('schedule/addSchedule', async ({ patientID, procedureCode }, thunkAPI) => {
    try {
        const reportResponse = await apiCreateReport({ patientID })
        const reportID = reportResponse.data._id
        await apiAddSchedule({ patientID, reportID, procedureCode, status: 'wait-examination' })
    } catch (e) {
        thunkAPI.dispatch(handleError(e.response))
        return thunkAPI.rejectWithValue()
    }
})

export const changeScheduleStatus = createAsyncThunk(
    'schedule/changeScheduleStatus',
    async ({ scheduleID, status }, thunkAPI) => {
        try {
            await apiUpdateScheduleStatus({ scheduleID, status })
        } catch (e) {
            thunkAPI.dispatch(handleError(e.response))
            return thunkAPI.rejectWithValue()
        }
    }
)

export const removeSchedule = createAsyncThunk('schedule/removeSchedule', async (patientID, thunkAPI) => {
    try {
        const response = await apiDeleteScheduleAndBloodAndReport(patientID)
        return response.data
    } catch (e) {
        thunkAPI.dispatch(handleError(e.response))
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
            thunkAPI.dispatch(handleError(e.response))
            return thunkAPI.rejectWithValue()
        }
    }
)

const initialState = { schedules: [], count: 0, loading: false }
const scheduleSlice = createSlice({
    name: 'schedule',
    initialState,
    reducers: {
        scheduleTrigger: (state, action) => {
            return { ...state, count: -1 }
        },
    },
    extraReducers: {
        [fetchSchedule.pending]: (state, action) => {
            return {
                ...state,
                loading: true,
            }
        },
        [fetchSchedule.fulfilled]: (state, action) => {
            return {
                ...state,
                ...action.payload,
                loading: false,
            }
        },
        [fetchSchedule.rejected]: (state, action) => {
            return {
                ...state,
                loading: false,
            }
        },
    },
})

export const { scheduleTrigger } = scheduleSlice.actions
export default scheduleSlice.reducer
