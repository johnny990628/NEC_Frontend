import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { apiDeleteReport, apiGetReports } from '../../Axios/Report'

import { handleError } from './Error'

export const fetchReport = createAsyncThunk('report/fetchReport', async (params, thunkAPI) => {
    try {
        const response = await apiGetReports(params)
        const { results, count } = response.data
        return { results, count, page: Math.ceil(count / params.limit) }
    } catch (e) {
        thunkAPI.dispatch(handleError(e.response))
        return thunkAPI.rejectWithValue()
    }
})
export const deleteReport = createAsyncThunk('report/deleteReport', async (reportID, thunkAPI) => {
    try {
        const response = await apiDeleteReport(reportID)
        return response.data
    } catch (e) {
        thunkAPI.dispatch(handleError(e.response))
        return thunkAPI.rejectWithValue()
    }
})

const initialState = { results: [], count: 0, page: 1, loading: false }

const reportSlice = createSlice({
    name: 'report',
    initialState,
    reducers: {
        reportTrigger: (state, action) => ({ ...state, count: -1 }),
    },
    extraReducers: {
        [fetchReport.pending]: (state, action) => {
            return {
                ...state,
                loading: true,
            }
        },
        [fetchReport.fulfilled]: (state, action) => {
            return {
                ...action.payload,
                loading: false,
            }
        },
        [fetchReport.rejected]: (state, action) => {
            return {
                ...state,
                loading: false,
            }
        },
    },
})

export const { reportTrigger } = reportSlice.actions

export default reportSlice.reducer
