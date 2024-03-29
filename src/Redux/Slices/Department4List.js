import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { apiGetDepartments } from '../../Axios/Department'

import { handleError } from './Error'

export const fetchDepartments4List = createAsyncThunk('department4lsit/fetchDepartments4List', async (_, thunkAPI) => {
    try {
        const departments = await apiGetDepartments({ limit: 100, offset: 0 })
        return { results: departments.data.results }
    } catch (e) {
        thunkAPI.dispatch(handleError(e.response))
        return thunkAPI.rejectWithValue()
    }
})

const initialState = { results: [] }
const department4ListSlice = createSlice({
    name: 'department4lsit',
    initialState,
    extraReducers: {
        [fetchDepartments4List.pending]: (state, action) => {
            return {
                ...state,
            }
        },
        [fetchDepartments4List.fulfilled]: (state, action) => {
            return {
                ...action.payload,
            }
        },
        [fetchDepartments4List.rejected]: (state, action) => {
            return {
                ...state,
            }
        },
    },
})

export default department4ListSlice.reducer
