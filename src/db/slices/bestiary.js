// Import core components
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

// Import our components
import { selectZone as selectTomeZone, updateZone as updateTomeZone } from 'db/slices/tome'
import { selectVersion } from 'db/slices/version'

import * as Storage from 'toolkits/storage'
import * as Utils from 'toolkits/utils'

const
    name = 'bestiary',
    initial_state = {
        encounter: {},
        zone: {},
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

// Redux Thunk: updateZone
export const updateZone = createAsyncThunk(`${name}/updateZone`, async (zone, api) => {
    const
        state = api.getState(),
        cached_zone = selectTomeZone(state, zone.id),
        current_version = selectVersion(state)

    try {
        // Valid existing zone
        if (cached_zone?.version === current_version) return cached_zone

        const new_zone = {
            ...zone,
            display_name: Utils.capitalize(zone.display_name),
            version: current_version,
        }

        // New zone
        api.dispatch(updateTomeZone(new_zone))

        return new_zone
    } catch (err) {
        return api.rejectWithValue(null)
    }
})

// Bestiary Slice
export const bestiary = createSlice({
    name: name,
    initialState: getState(),
    extraReducers: {
        [updateZone.fulfilled]: (state, { payload: zone }) => {
            state.zone = zone
        }
    },
})

// Reducer functions
// export const {} = bestiary.actions

// Selector functions
export const selectZone = (state) => state[name].zone

export default bestiary.reducer