// Import core components
import { createSlice } from '@reduxjs/toolkit'

// Import our components
import * as Storage from 'toolkits/storage'
import * as Utils from 'toolkits/utils'

const
    name = 'spellbook',
    initial_state = {
        resting: {},
        party: {},
        you: 'Shekawa Phen',
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
        updateResting: (state, { payload: id }) => {
            id = Utils.h2d(id)

            const action = Storage.get(`action.${id}`)

            state.obj.resting[action.id] = { ...action }
        },
        updateParty: (state, action) => {
            state.obj.party = action.payload
        },
    }
})

// Reducer functions
export const {
    initYou,
    updateResting,
    updateParty,
} = spellbook.actions

// Selector functions
export const selectResting = (state) => state.spellbook.obj.resting
export const selectParty = (state) => state.spellbook.obj.party
export const selectYou = (state) => state.spellbook.obj.you

export default spellbook.reducer