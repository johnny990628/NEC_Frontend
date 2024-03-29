import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { apiAddBlood } from '../../Axios/Blood'
import { apiCreateReport, apiDeleteReport } from '../../Axios/Report'
import { apiAddSchedule, apiDeleteScheduleAndReport, apiGetSchdules, apiRemoveSchedule } from '../../Axios/Schedule'
import { apiAddWorklist } from './../../Axios/WorkList'
import { apiUpdateScheduleStatus } from './../../Axios/Schedule'

import { handleError } from './Error'

export const fetchSchedule = createAsyncThunk('schedule/fetchSchedule', async (params, thunkAPI) => {
    try {
        const response = await apiGetSchdules(params)
        const { results, count } = response.data

        return {
            schedules: results,
            count,
            page: Math.ceil(count / params.limit),
        }
    } catch (e) {
        thunkAPI.dispatch(handleError(e.response))
        return thunkAPI.rejectWithValue()
    }
})

export const addSchedule = createAsyncThunk('schedule/addSchedule', async ({ patientID, procedureCode }, thunkAPI) => {
    try {
        const workListResponse = await apiAddWorklist(patientID).then((res) => res.data)
        const reportResponse = await apiCreateReport({ patientID })
        const reportID = reportResponse.data._id
        await apiAddSchedule({
            patientID,
            reportID,
            procedureCode,
            accessionNumber: workListResponse.accessionNumber,
            StudyInstanceUID: workListResponse.StudyInstanceUID,
            status: 'wait-examination',
        })
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

export const removeSchedule = createAsyncThunk('schedule/removeSchedule', async (scheduleID, thunkAPI) => {
    try {
        const response = await apiDeleteScheduleAndReport(scheduleID)
        return response.data
    } catch (e) {
        thunkAPI.dispatch(handleError(e.response))
        return thunkAPI.rejectWithValue()
    }
})

const initialState = { schedules: [], count: 0, page: 1, loading: false }
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
