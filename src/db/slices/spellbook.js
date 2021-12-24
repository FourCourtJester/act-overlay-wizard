// Import core components
import { createSlice } from '@reduxjs/toolkit'

// Import our components
import { setObjValue } from 'toolkits/utils'

const
    initial_state = {
        party: {},
        actions: {},
        you: null,
    }

// Jobs Slice
export const spellbook = createSlice({
    name: 'spellbook',
    initialState: {
        obj: initial_state,
    },
    reducers: {
        initActions: (state, action) => {
            state.actions = action.payload
        },
        initYou: (state, action) => {
            state.you = action.payload
        },
        updateParty: (state, action) => {
            state.party = action.payload
        },
    }
})

// Reducer functions
export const {
    initActions,
    initYou,
    updateParty,
} = spellbook.actions

// Selector functions
export const selectActions = (state) => state.spellbook.obj.actions
export const selectParty = (state) => state.spellbook.obj.party
export const selectYou = (state) => state.spellbook.obj.you

export default spellbook.reducer