// Import core components
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

// Import our components
import { selectAction, selectRecast, updateAction } from 'db/slices/tome'
import { selectVersion } from 'db/slices/version'

// import * as Utils from 'toolkits/utils'
import * as XIVAPI from 'toolkits/xivapi'

const
    name = 'spellbook',
    initial_state = {
        resting: {},
        restricted: ['attack', 'Mount', 'mount', 'item'],
        party: {},
        you: null,
    }

// Redux Thunk: updateResting
export const updateResting = createAsyncThunk(`${name}/updateResting`, async (id, api) => {
    const
        state = api.getState(),
        recast_cutoff = selectRecast(state)

    try {
        const
            cached_action = selectAction(state, id),
            current_version = selectVersion(state)

        // Valid existing action
        if (cached_action?.version === current_version) {
            if ((cached_action?.recast || 0) <= recast_cutoff) throw new Error(null)
            return cached_action
        }

        const new_action = await XIVAPI.get('action', { id, version: current_version })

        // Action ID isn't a registered player action
        if (new_action === null) throw new Error(null)

        // New action
        api.dispatch(updateAction(new_action))

        // Action is below desired recast cutoff
        if ((new_action?.recast || 0) <= recast_cutoff) throw new Error(null)

        return new_action
    } catch (err) {
        return api.rejectWithValue(null)
    }
})

// Spellbook Slice
export const spellbook = createSlice({
    name: name,
    initialState: initial_state,
    reducers: {
        clearResting: (state, _) => {
            state.resting = {}
        },
        initRestricted: (state, action) => {
            state.restricted = initial_state.restricted
        },
        initYou: (state, { payload: name }) => {
            state.you = name
        },
        updateParty: (state, action) => {
            state.party = action.payload
        },
        updateRecast: (state, { payload }) => {
            payload.forEach((action) => {
                if (action.recast < 0) delete state.resting[action.id]
                else state.resting[action.id].recast = action.recast
            })
        },
    },
    extraReducers: {
        [updateResting.fulfilled]: (state, { payload: action }) => {
            state.resting[action.id] = { ...action }
        },
    },
})

// Reducer functions
export const {
    clearResting,
    initRestricted,
    initYou,
    updateParty,
    updateRecast,
} = spellbook.actions

// Selector functions
export const selectResting = (state) => state[name].resting
export const selectRestricted = (state) => state[name].restricted
export const selectParty = (state) => state[name].party
export const selectYou = (state) => state[name].you

export default spellbook.reducer