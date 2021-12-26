// Import core components
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

// Import our components
import * as Storage from 'toolkits/storage'
import * as Utils from 'toolkits/utils'
import * as XIVAPI from 'toolkits/xivapi'

const
    name = 'tome',
    initial_state = {
        actions: {},
        instances: {},
        jobs: {},
    }

export const updateAction = createAsyncThunk(`${name}/updateAction`, async (id, api) => {
    id = Utils.h2d(id)
    
    let
        action = Storage.get(`action.${id}`),
        update_required = false

    // No stored actions
    if (action === null) {
        action = await XIVAPI.get('action', id)
        update_required = true
    }

    // Update stored action
    if (update_required) Storage.set(`action.${id}`, action)

    // Update state
    return action
})

// Jobs Slice
export const tome = createSlice({
    name: name,
    initialState: {
        obj: initial_state,
    },
    extraReducers: {
        [updateAction.fulfilled]: (state, action) => {
            state.obj.actions[action.payload.id] = action.payload
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