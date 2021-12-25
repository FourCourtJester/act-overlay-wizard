// Import core components
import { createSlice } from '@reduxjs/toolkit'

// Import our components
import actions_json from 'data/actions'

const
    initial_state = {
        actions: actions_json,
        resting: {},
        party: {},
        you: 'Shekawa Phen',
    }

// Jobs Slice
export const spellbook = createSlice({
    name: 'spellbook',
    initialState: {
        obj: initial_state,
    },
    reducers: {
        initYou: (state, action) => {
            state.obj.you = action.payload
        },
        updateResting: (state, action) => {
            state.obj.resting[action.payload] = { ...state.obj.actions[action.payload] }
        },
        updateParty: (state, action) => {
            state.obj.party = action.payload
        },
    }
})

// Reducer functions
export const {
    initActions,
    initYou,
    updateResting,
    updateParty,
} = spellbook.actions

// Selector functions
export const selectActions = (state) => state.spellbook.obj.actions
export const selectResting = (state) => state.spellbook.obj.resting
export const selectParty = (state) => state.spellbook.obj.party
export const selectYou = (state) => state.spellbook.obj.you

export default spellbook.reducer