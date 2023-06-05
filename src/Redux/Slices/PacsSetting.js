import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { apiGetPacsSetting } from '../../Axios/PacsSetting'
import { apiUpdatePacsSetting } from '../../Axios/PacsSetting'

import { handleError } from './Error'

export const fetchPacsSetting = createAsyncThunk('pacsSetting/fetchPacsSetting', async (params, thunkAPI) => {
    try {
        const response = await apiGetPacsSetting()
        const { results, count } = response.data
        return { results, count }
    } catch (e) {
        thunkAPI.dispatch(handleError(e.response))
        return thunkAPI.rejectWithValue()
    }
})

export const updatePacsSetting = createAsyncThunk('pacsSetting/updatePacsSetting', async (data, thunkAPI) => {
    try {
        const response = await apiUpdatePacsSetting(data._id, data)
        return response.data
    } catch (e) {
        thunkAPI.dispatch(handleError(e.response))
        return thunkAPI.rejectWithValue()
    }
})

const initialState = { results: [], count: 0 }

const pacsSettingSlice = createSlice({
    name: 'pacsSetting',
    initialState,
    reducers: {
        pacsSettingTrigger: (state, action) => ({ ...state, count: -1 }),
    },
    extraReducers: {
        [fetchPacsSetting.pending]: (state, action) => {
            return {
                ...state,
                loading: true,
            }
        },
        [fetchPacsSetting.fulfilled]: (state, action) => {
            return {
                ...action.payload,
                loading: false,
            }
        },
        [fetchPacsSetting.rejected]: (state, action) => {
            return {
                ...state,
                loading: false,
            }
        },
        [updatePacsSetting.pending]: (state, action) => {
            return {
                ...state,
                loading: true,
            }
        },
        [updatePacsSetting.fulfilled]: (state, action) => {
            const updatedData = action.payload
            if (Array.isArray(state.results)) {
                // If results is an array, find the index of the item with the matching _id and update it
                const updatedResults = state.results.map((item) => {
                    if (item._id === updatedData._id) {
                        return updatedData
                    }
                    return item
                })
                return {
                    ...state,
                    results: updatedResults,
                    loading: false,
                }
            } else {
                // If results is not an array, simply update the results with the new data
                return {
                    ...state,
                    results: updatedData,
                    loading: false,
                }
            }
        },
        [updatePacsSetting.rejected]: (state, action) => {
            console.log('updatePacsSetting.rejected', action)
            return {
                ...state,
                loading: false,
            }
        },
    },
})

export const { pacsSettingTrigger } = pacsSettingSlice.actions
export default pacsSettingSlice.reducer
