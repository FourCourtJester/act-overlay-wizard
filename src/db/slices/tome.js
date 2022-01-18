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
        zones: {},
    }

function getState() {
    try {
        const persistent_state = Utils.getObjValue(Storage.get(`redux`), name) || {}

        return Object
            .entries(Utils.getObjPaths(persistent_state))
            .reduce((obj, [key, val]) => {
                Utils.setObjValue(obj, key, val)
                return obj
            }, initial_state)
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
        updateStatus: (state, { payload: status }) => {
            state.statuses[status.id] = status
        },
        updateZone: (state, { payload: zone }) => {
            state.zones[zone.id] = zone
        },
    }
})

// Reducer functions
export const {
    updateAction,
    updateStatus,
    updateZone,
} = tome.actions

// Selector functions
export const selectAction = (state, id) => state[name].actions?.[id]
export const selectActions = (state) => state[name].actions
export const selectInstances = (state) => state[name].instances
export const selectJobs = (state) => state[name].jobs
export const selectStatus = (state, id) => state[name].statuses?.[id]
export const selectRecast = (state) => state[name].recast
export const selectZone = (state, id) => state[name].zones?.[id]

export default tome.reducer