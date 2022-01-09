// Import core components
import { createSlice } from '@reduxjs/toolkit'

// Import our components
// import * as Utils from 'toolkits/utils'

const
    name = 'tome',
    recast_cutoff = 3,
    initial_state = {
        actions: {},
        instances: {},
        jobs: {},
        recast: recast_cutoff
    }

// Tomes Slice
export const tome = createSlice({
    name: name,
    initialState: initial_state,
    reducers: {
        initRecast: (state, action) => {
            state.recast = initial_state.recast
        },
        updateAction: (state, { payload: action }) => {
            state.actions[action.id] = action
        }
    }
})

// Reducer functions
export const {
    initRecast,
    updateAction
} = tome.actions

// Selector functions
export const selectAction = (state, id) => state[name].actions?.[id]
export const selectActions = (state) => state[name].actions
export const selectInstances = (state) => state[name].instances
export const selectJobs = (state) => state[name].jobs
export const selectRecast = (state) => state[name].recast

export default tome.reducer