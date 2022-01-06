// Import core components
import { createSlice } from '@reduxjs/toolkit'

// Import our components
import { updateAction as tome_update_action } from 'db/slices/tome'
// import * as Storage from 'toolkits/storage'
// import * as Utils from 'toolkits/utils'

const
    name = 'spellbook',
    initial_state = {
        resting: {},
        restricted: ['Mount', 'mount', 'item'],
        party: {},
        you: null,
    }

// Jobs Slice
export const spellbook = createSlice({
    name: name,
    initialState: {
        obj: initial_state,
    },
    reducers: {
        initYou: (state, { payload: name }) => {
            state.obj.you = name
        },
        removeResting: (state, _) => {
            state.obj.resting = {}
        },
        updateParty: (state, action) => {
            state.obj.party = action.payload
        },
        updateRecast: (state, { payload }) => {
            payload.forEach((action) => {
                if (action.recast < 0) delete state.obj.resting[action.id]
                else state.obj.resting[action.id].recast = action.recast
            })
        },
    },
    extraReducers: {
        [tome_update_action.fulfilled]: (state, { payload: action }) => {
            state.obj.resting[action.id] = { ...action }
        },
    },
})

// Reducer functions
export const {
    initYou,
    removeResting,
    updateParty,
    updateRecast,
} = spellbook.actions

// Selector functions
export const selectResting = (state) => state.spellbook.obj.resting
export const selectRestricted = (state) => state.spellbook.obj.restricted
export const selectParty = (state) => state.spellbook.obj.party
export const selectYou = (state) => state.spellbook.obj.you

export default spellbook.reducer