import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { apiGetCounts } from '../../Axios/Count'
import { apiGetPatients } from '../../Axios/Patient'
import { apiGetReports } from '../../Axios/Report'
import { apiGetSchdules } from '../../Axios/Schedule'

import { handleError } from './Error'

export const fetchDashboard = createAsyncThunk('report/fetchDashboard', async (_, thunkAPI) => {
    try {
        const patients = await apiGetPatients({ limit: 5, offset: 0, sort: 'createdAt', desc: -1, status: 'all' })
        const reports = await apiGetReports({ limit: 5, offset: 0, sort: 'createdAt', desc: -1 })
        const schedules = await apiGetSchdules({
            limit: 5,
            offset: 0,
            sort: 'createdAt',
            desc: -1,
            status: 'wait-examination',
        })
        const count = await apiGetCounts()
        return {
            patients: patients.data.results,
            reports: reports.data.results,
            schedules: schedules.data.results,
            count: count.data,
        }
    } catch (e) {
        thunkAPI.dispatch(handleError(e.response))
        return thunkAPI.rejectWithValue()
    }
})
const initialState = { patients: [], reports: [], schedules: [], count: { patient: 0, report: 0, schedule: 0 } }
const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {},
    extraReducers: {
        [fetchDashboard.fulfilled]: (state, action) => {
            return {
                ...action.payload,
            }
        },
        [fetchDashboard.rejected]: (state, action) => {
            return initialState
        },
    },
})

export default dashboardSlice.reducer
