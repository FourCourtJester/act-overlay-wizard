// Import core components
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

// Import our components
import { selectStatus, updateStatus } from 'db/slices/tome'
import { selectVersion } from 'db/slices/version'

import * as Utils from 'toolkits/utils'
import * as XIVAPI from 'toolkits/xivapi'

const
    name = 'dynamis',
    initial_state = {
        active: {},
        inclusive: [
            Utils.d2h(2282), // Embolden
        ],
    }

// Redux Thunk: addStatus
export const addStatus = createAsyncThunk(`${name}/addStatus`, async ({ id, duration }, api) => {
    const
        state = api.getState(),
        cached_status = selectStatus(state, id),
        current_version = selectVersion(state)

    try {
        // Valid existing status
        if (cached_status?.version === current_version) {
            if (cached_status.is_FC || !cached_status.has_duration) throw new Error(null)
            return cached_status
        }

        let new_status = await XIVAPI.get('status', id)

        // Action ID isn't a registered player status
        if (new_status === null) throw new Error(null)

        new_status = {
            ...new_status,
            duration: +duration,
            version: current_version,
        }

        // New status
        api.dispatch(updateStatus(new_status))

        // Status is either from the Free Company or does not expire
        if (new_status.is_FC || !new_status.has_duration) throw new Error(null)

        return new_status
    } catch (err) {
        return api.rejectWithValue(null)
    }
})

// Dynamis Slice
export const dynamis = createSlice({
    name: name,
    initialState: initial_state,
    reducers: {
        init: (state, status) => {
            state.inclusive = initial_state.inclusive
        },
        remove: (state, { payload: id }) => {
            delete state.active[id]
        },
        update: (state, { payload }) => {
            payload.forEach((status) => {
                if (status.duration < 0) delete state.active[status.id]
                else state.active[status.id].duration = status.duration
            })
        },
    },
    extraReducers: {
        [addStatus.fulfilled]: (state, { payload: status }) => {
            state.active[status.id] = { ...status }
        },
    },
})

// Reducer functions
export const {
    init: initInclusive,
    remove: removeStatus,
    update: updateDuration,
} = dynamis.actions

// Selector functions
export const selectActive = (state) => state[name].active
export const selectInclusive = (state) => state[name].inclusive

export default dynamis.reducer