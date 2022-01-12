// Import core components
import { createSlice } from '@reduxjs/toolkit'

// Import our components
import * as Storage from 'toolkits/storage'
import * as Utils from 'toolkits/utils'

const
    name = 'tome',
    recast_cutoff = 5,
    initial_state = {
        actions: {},
        instances: {},
        jobs: {},
        recast: recast_cutoff,
        statuses: {},
    }

function getState() {
    try {
        const persistent_state = Utils.getObjValue(Storage.get(`redux`), name) || initial_state

        // Ensure certain fields exist
        Utils.setObjValue(persistent_state, 'recast', initial_state.recast)

        return persistent_state
    } catch (err) {
        console.error(err)
        return initial_state
    }
}

// Tomes Slice
export const tome = createSlice({
    name: name,
    initialState: getState(),
    reducers: {
        updateAction: (state, { payload: action }) => {
            state.actions[action.id] = action
        },
        updateStatus: (state, { payload: action }) => {
            state.statuses[action.id] = action
        }
    }
})

// Reducer functions
export const {
    updateAction,
    updateStatus
} = tome.actions

// Selector functions
export const selectAction = (state, id) => state[name].actions?.[id]
export const selectActions = (state) => state[name].actions
export const selectInstances = (state) => state[name].instances
export const selectJobs = (state) => state[name].jobs
export const selectStatus = (state, id) => state[name].statuses?.[id]
export const selectRecast = (state) => state[name].recast

export default tome.reducer