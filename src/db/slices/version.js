// Import core components
import { createSlice } from '@reduxjs/toolkit'

// Import our components
// ...

const
    name = 'version',
    initial_state = {
        id: '6.05',
    }

// Jobs Slice
export const version = createSlice({
    name: name,
    initialState: initial_state,
    reducers: {
        check: (state, action) => {
            // Update the actual version
            state.id = initial_state.id
        },
    }
})

// Reducer functions
export const {
    check: checkVersion
} = version.actions

// Selector functions
export const selectVersion = (state) => state[name].id

export default version.reducer