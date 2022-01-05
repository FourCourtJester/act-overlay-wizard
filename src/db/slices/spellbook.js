// Import core components
import { createSlice } from '@reduxjs/toolkit'

// Import our components
import * as Storage from 'toolkits/storage'
import * as Utils from 'toolkits/utils'

const
    name = 'spellbook',
    recast_cutoff = 2.5,
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
        updateResting: (state, { payload: id }) => {
            id = Utils.h2d(id)

            const action = Storage.get(`action.${id}`)

            if (action.recast > recast_cutoff) state.obj.resting[action.id] = { ...action }
        },
    }
})

// Reducer functions
export const {
    initYou,
    removeResting,
    updateParty,
    updateRecast,
    updateResting
} = spellbook.actions

// Selector functions
export const selectResting = (state) => state.spellbook.obj.resting
export const selectParty = (state) => state.spellbook.obj.party
export const selectYou = (state) => state.spellbook.obj.you

export default spellbook.reducer