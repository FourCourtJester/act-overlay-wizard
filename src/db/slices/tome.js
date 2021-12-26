// Import core components
import { createSlice } from '@reduxjs/toolkit'

// Import our components
import actions_json from 'data/actions'
import instances_json from 'data/instances'
import jobs_json from 'data/jobs'

const
    initial_state = {
        actions: actions_json,
        instances: instances_json,
        jobs: jobs_json
    }

// Jobs Slice
export const tome = createSlice({
    name: 'tome',
    initialState: {
        obj: initial_state,
    }
})

// Reducer functions
// export const {} = tome.actions

// Selector functions
export const selectActions = (state) => state.tome.obj.actions
export const selectInstances = (state) => state.tome.obj.instances
export const selectJobs = (state) => state.tome.obj.jobs

export default tome.reducer