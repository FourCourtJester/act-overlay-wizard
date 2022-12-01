// Import core components
import { createSlice } from '@reduxjs/toolkit'

// Import our components
import * as Storage from 'toolkits/storage'
import * as Utils from 'toolkits/utils'

const name = 'combatant'
const initialState = {
  entries: {},
}

function getState() {
  try {
    const persistentState = Utils.getObjValue(Storage.get(`redux`), name) || {}
    const state = { ...initialState }

    Utils.getObjPaths(persistentState, (key, val) => {
      Utils.setObjValue(state, key, val)
    })

    return state
  } catch (err) {
    console.error(err)
    return initialState
  }
}

// Combatant Slice
export const combatant = createSlice({
  name: 'combatant',
  initialState: getState(),
  reducers: {
    add: (state, { payload }) => {
      Utils.setObjValue(state.entries, payload.actorID, payload)
    },
    remove: (state, { payload }) => {
      delete state.entries[payload.actorID]
    },
  },
})

// Reducer functions
export const { add: addCombatantEntry, remove: removeCombatantEntry } = combatant.actions

// Selector functions
export const selectCombatantEntry = (state, id) =>
  // console.log(state, id)
  Utils.getObjValue(state.combatant.entries, id) || []

export default combatant.reducer
