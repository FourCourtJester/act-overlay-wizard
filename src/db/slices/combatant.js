// Import core components
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

// Import our components
import { updateJob } from 'db/slices/job'

import * as Storage from 'toolkits/storage'
import * as Utils from 'toolkits/utils'

const name = 'combatant'
const initialState = {}

// function getState() {
//   try {
//     const persistentState = Utils.getObjValue(Storage.get(`redux`), name) || {}
//     const state = { ...initialState }

//     Utils.getObjPaths(persistentState, (key, val) => {
//       Utils.setObjValue(state, key, val)
//     })

//     return state
//   } catch (err) {
//     console.error(err)
//     return initialState
//   }
// }

function _getCombatant(state, id) {
  return Utils.getObjValue(state.combatant, id)
}

export const updateCombatant = createAsyncThunk(`${name}/update`, (actor, api) => {
  try {
    if (!actor || !Object.keys(actor).length) throw new Error()

    return actor?.actorJob
      ? api
          .dispatch(updateJob(actor.actorJob))
          .unwrap()
          .then(() => actor)
      : actor
  } catch (err) {
    return api.rejectWithValue(null)
  }
})

// Combatant Slice
export const combatant = createSlice({
  name: 'combatant',
  initialState, // getState(),
  reducers: {
    remove: (state, { payload }) => {
      delete state[payload.actorID]
    },
    removeAll: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(updateCombatant.fulfilled, (state, { payload }) => {
      const actor = Utils.getObjValue(state, payload.actorID)
      state[payload.actorID] = actor ? { ...actor, ...payload } : payload
    })
  },
})

// Reducer functions
export const { remove: removeCombatant, removeAll: removeCombatants } = combatant.actions

// Selector functions
export const selectCombatant = (state, id) => _getCombatant(state, id)

export default combatant.reducer
