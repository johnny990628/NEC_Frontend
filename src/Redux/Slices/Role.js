import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { handleError } from './Error'
import { apiGetRoles } from '../../Axios/Role'

export const fetchRole = createAsyncThunk('role/fetchRole', async (params, thunkAPI) => {
    try {
        const response = await apiGetRoles()
        const { results, count } = response.data
        return { results, count }
    } catch (e) {
        thunkAPI.dispatch(handleError(e.response))
        return thunkAPI.rejectWithValue()
    }
})

const initialState = { results: [], count: 0, loading: false }

const roleSlice = createSlice({
    name: 'role',
    initialState,
    extraReducers: {
        [fetchRole.pending]: (state, action) => {
            return {
                ...state,
                loading: true,
            }
        },
        [fetchRole.fulfilled]: (state, action) => {
            return {
                ...action.payload,
                loading: false,
            }
        },
        [fetchRole.rejected]: (state, action) => {
            return {
                ...state,
                loading: false,
            }
        },
    },
})

export default roleSlice.reducer
