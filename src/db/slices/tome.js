// Import core components
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

// Import our components
import * as Storage from 'toolkits/storage'
import * as Utils from 'toolkits/utils'
import * as XIVAPI from 'toolkits/xivapi'

const
    name = 'tome',
    recast_cutoff = 2.5,
    initial_state = {
        actions: {},
        instances: {},
        jobs: {},
    }

export const updateAction = createAsyncThunk(`${name}/updateAction`, async (id, api) => {
    id = Utils.h2d(id)

    let action = Storage.get(`action.${id}`)

    // No stored actions
    if (action !== null) return action

    try {
        action = await XIVAPI.get('action', id)

        // Action is below desired recast cutoff
        if ((action?.recast || 0) <= recast_cutoff) return api.rejectWithValue(null)

        // New action
        Storage.set(`action.${id}`, action)
        return action
    } catch (err) {
        // Not an action
        Storage.set(`action.${id}`, {
            id: id,
            display_name: null,
        })

        return api.rejectWithValue(null)
    }
})

// Jobs Slice
export const tome = createSlice({
    name: name,
    initialState: {
        obj: initial_state,
    },
    extraReducers: {
        [updateAction.fulfilled]: (state, { payload: action }) => {
            state.obj.actions[action.id] = action
        },
    },
})

// Reducer functions
// export const {} = tome.actions

// Selector functions
export const selectActions = (state) => state.tome.obj.actions
export const selectInstances = (state) => state.tome.obj.instances
export const selectJobs = (state) => state.tome.obj.jobs

export default tome.reducer