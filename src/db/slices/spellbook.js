// Import core components
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

// Import our components
import { selectAction, selectRecast, updateAction } from 'db/slices/tome'
import { selectVersion } from 'db/slices/version'

import * as Storage from 'toolkits/storage'
import * as Utils from 'toolkits/utils'
import * as XIVAPI from 'toolkits/xivapi'

const
    name = 'spellbook',
    initial_state = {
        resting: {},
        restricted: ['attack', 'mount', 'item'],
        you: null,
    }

function getState() {
    try {
        const persistent_state = Utils.getObjValue(Storage.get(`redux`), name) || initial_state

        // Ensure certain fields exist
        Utils.setObjValue(persistent_state, 'restricted', initial_state.restricted)

        return persistent_state
    } catch (err) {
        console.error(err)
        return initial_state
    }
}

// Redux Thunk: updateResting
export const updateResting = createAsyncThunk(`${name}/updateResting`, async (id, api) => {
    const
        state = api.getState(),
        recast_cutoff = selectRecast(state),
        cached_action = selectAction(state, id),
        current_version = selectVersion(state)

    try {
        // Valid existing action
        if (cached_action?.version === current_version) {
            if ((cached_action?.recast || 0) <= recast_cutoff) throw new Error(null)
            return cached_action
        }

        let new_action = await XIVAPI.get('action', id)

        // Action ID isn't a registered player action
        if (new_action === null) throw new Error(null)

        new_action = {
            ...new_action,
            recast: [new_action.recast],
            version: current_version,
        }

        // New action
        api.dispatch(updateAction(new_action))

        // Action is below desired recast cutoff
        if ((new_action?.recast[0] || 0) <= recast_cutoff) throw new Error(null)

        return new_action
    } catch (err) {
        return api.rejectWithValue(null)
    }
})

// Spellbook Slice
export const spellbook = createSlice({
    name: name,
    initialState: getState(),
    reducers: {
        clear: (state, _) => {
            state.resting = {}
        },
        initYou: (state, { payload: name }) => {
            state.you = name
        },
        update: (state, { payload }) => {
            payload.forEach((action) => {
                if (action.recast[0] < 0) action.recast.shift()

                // Remove the resting action
                if (!action.recast.length) {
                    delete state.resting[action.id]
                    return
                }

                state.resting[action.id].recast = action.recast
            })
        },
    },
    extraReducers: {
        [updateResting.fulfilled]: (state, { payload: action }) => {
            if (state.resting?.[action.id]) {
                state.resting[action.id] = {
                    ...state.resting[action.id],
                    recast: state.resting[action.id].recast.slice().concat(action.recast.slice())
                }
            } else {
                state.resting[action.id] = { ...action }
            }
        },
    },
})

// Reducer functions
export const {
    clear: clearResting,
    initYou,
    update: updateRecast,
} = spellbook.actions

// Selector functions
export const selectResting = (state) => state[name].resting
export const selectRestricted = (state) => state[name].restricted
export const selectYou = (state) => state[name].you

export default spellbook.reducer