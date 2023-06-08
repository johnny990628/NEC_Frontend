import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { apiGetPacsSetting } from '../../Axios/PacsSetting'
import { apiUpdatePacsSetting } from '../../Axios/PacsSetting'
import { apiDeletePacsSetting } from '../../Axios/PacsSetting'
import { apiCreatePacsSetting } from '../../Axios/PacsSetting'
import { apiUpDatePacsSettingSort } from '../../Axios/PacsSetting'

import { handleError } from './Error'

export const fetchPacsSetting = createAsyncThunk('pacsSetting/fetchPacsSetting', async (params, thunkAPI) => {
    try {
        const response = await apiGetPacsSetting()
        const { results, count } = response.data
        return {
            results,
            count,
        }
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

export const deletePacsSetting = createAsyncThunk('pacsSetting/deletePacsSetting', async (data, thunkAPI) => {
    try {
        const response = await apiDeletePacsSetting(data._id)
        return response.data
    } catch (e) {
        thunkAPI.dispatch(handleError(e.response))
        return thunkAPI.rejectWithValue()
    }
})

export const upDatePacsSettingSort = createAsyncThunk('pacsSetting/upDatePacsSettingSort', async (datas, thunkAPI) => {
    try {
        const response = await apiUpDatePacsSettingSort(datas)
        const { results, count } = response.data
        return {
            results,
            count,
        }
    } catch (e) {
        thunkAPI.dispatch(handleError(e.response))
        return thunkAPI.rejectWithValue()
    }
})

export const createPacsSetting = createAsyncThunk('pacsSetting/createPacsSetting', async (data, thunkAPI) => {
    try {
        const response = await apiCreatePacsSetting(data)
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
        [upDatePacsSettingSort.pending]: (state, action) => {
            return {
                ...state,
                loading: true,
            }
        },
        [upDatePacsSettingSort.fulfilled]: (state, action) => {
            return {
                ...action.payload,
                loading: false,
            }
        },
        [upDatePacsSettingSort.rejected]: (state, action) => {
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
            return {
                ...state,
                loading: false,
            }
        },

        [deletePacsSetting.pending]: (state, action) => {
            return {
                ...state,
                loading: true,
            }
        },
        [deletePacsSetting.fulfilled]: (state, action) => {
            const deletedData = action.payload
            if (Array.isArray(state.results)) {
                // If results is an array, find the index of the item with the matching _id and remove it

                const updatedResults = state.results.filter((item) => item._id !== deletedData._id)
                return {
                    ...state,
                    results: updatedResults,
                    loading: false,
                }
            } else {
                // If results is not an array, simply update the results with the new data
                return {
                    ...state,
                    results: [],
                    loading: false,
                }
            }
        },
        [deletePacsSetting.rejected]: (state, action) => {
            return {
                ...state,
                loading: false,
            }
        },
        [createPacsSetting.pending]: (state, action) => {
            return {
                ...state,
                loading: true,
            }
        },
        [createPacsSetting.fulfilled]: (state, action) => {
            const createdData = action.payload
            if (Array.isArray(state.results)) {
                // If results is an array, find the index of the item with the matching _id and remove it

                const updatedResults = state.results.concat(createdData)
                return {
                    ...state,
                    results: updatedResults,
                    loading: false,
                }
            } else {
                // If results is not an array, simply update the results with the new data
                return {
                    ...state,
                    results: [createdData],
                    loading: false,
                }
            }
        },
        [createPacsSetting.rejected]: (state, action) => {
            return {
                ...state,
                loading: false,
            }
        },
    },
})

export const { pacsSettingTrigger } = pacsSettingSlice.actions
export default pacsSettingSlice.reducer
