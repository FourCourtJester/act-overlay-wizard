// Import core components
import { createSlice } from '@reduxjs/toolkit'

// Import our components
// ...

import * as Storage from 'toolkits/storage'
import * as Utils from 'toolkits/utils'

const
    name = 'bestiary',
    initial_state = {
        encounter: {},
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

// Bestiary Slice
export const bestiary = createSlice({
    name: name,
    initialState: getState(),
    reducers: {},
})

// Reducer functions
// export const {} = bestiary.actions

// Selector functions
// ...

export default bestiary.reducer