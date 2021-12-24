// Import core components
import { createSlice } from '@reduxjs/toolkit'

// Import our components
import { setObjValue } from 'toolkits/utils'

const
    initial_state = {
        actions: {},
        instances: {},
        jobs: {},
    }

// Jobs Slice
export const quill = createSlice({
    name: 'quill',
    initialState: {
        obj: initial_state,
    },
    reducers: {
        updateActions: (state, action) => {
            setObjValue(state.obj.actions, action.payload.id.toString(), action.payload)
        },
        updateInstances: (state, action) => {
            setObjValue(state.obj.instances, action.payload.id.toString(), action.payload)
        },
        updateJobs: (state, action) => {
            // Save by id, display_name or short_name ??
            setObjValue(state.obj.jobs, action.payload.id.toString(), action.payload)
        }
    }
})

// Reducer functions
export const {
    updateActions,
    updateInstances,
    updateJobs,
} = quill.actions

// Selector functions
export const selectActions = (state) => state.quill.obj.actions
export const selectInstances = (state) => state.quill.obj.instances
export const selectJobs = (state) => state.quill.obj.jobs

export default quill.reducer