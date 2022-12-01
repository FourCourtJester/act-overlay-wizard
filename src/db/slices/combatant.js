// Import core components
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

// Import our components
import { selectVersion } from 'db/slices/version'
import { updateJob } from 'db/slices/job'

import * as Storage from 'toolkits/storage'
import * as Utils from 'toolkits/utils'

const name = 'combatant'
const initialState = {}

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

function _getCombatant(state, id) {
  return Utils.getObjValue(state.combatant, id)
}

export const addCombatant = createAsyncThunk(`${name}/add`, async (actor, api) => {
  try {
    await api.dispatch(updateJob(actor.actorJob))
    return actor
  } catch (err) {
    return api.rejectWithValue(null)
  }
})

// Combatant Slice
export const combatant = createSlice({
  name: 'combatant',
  initialState: getState(),
  reducers: {
    remove: (state, { payload }) => {
      delete state[payload.actorID]
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addCombatant.fulfilled, (state, { payload }) => {
      state[payload.actorID] = payload
    })
  },
})

// Reducer functions
export const { remove: removeCombatant } = combatant.actions

// Selector functions
export const selectCombatant = (state, id) => _getCombatant(state, id)

export default combatant.reducer
