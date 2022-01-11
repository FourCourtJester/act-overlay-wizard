// Import core components
import { createSlice } from '@reduxjs/toolkit'

// Import our components
import * as Storage from 'toolkits/storage'
import * as Utils from 'toolkits/utils'

const
    name = 'version',
    initial_state = {
        id: '6.05.b'
    }

function getState() {
    try {
        const persistent_state = Utils.getObjValue(Storage.get(`redux`), name) || initial_state

        // Ensure certain fields exist
        Utils.setObjValue(persistent_state, 'id', initial_state.id)
        
        return persistent_state
    } catch (err) {
        console.error(err)
        return initial_state
    }
}

// Jobs Slice
export const version = createSlice({
    name: name,
    initialState: getState(),
    reducers: {}
})

// Reducer functions
// export const {} = version.actions

// Selector functions
export const selectVersion = (state) => state[name].id

export default version.reducer