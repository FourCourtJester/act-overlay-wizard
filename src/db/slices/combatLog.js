// Import core components
import { createSlice } from '@reduxjs/toolkit'

// Import our components
import * as Storage from 'toolkits/storage'
import * as Utils from 'toolkits/utils'

const name = 'combatLog'
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

// CombatLog Slice
export const combatLog = createSlice({
  name: 'combatLog',
  initialState: getState(),
  reducers: {
    add: (state, action) => {
      // console.log('Create Combat Log: ', action.payload)
      Utils.setObjValue(state, action.payload, [])
    },
    update: (state, action) => {
      const log = Utils.getObjValue(state, action.payload?.id)
      if (log && action.payload?.entry) {
        log.push(action.payload.entry)
      }
    },
  },
})

// Reducer functions
export const { add: addCombatLog, update: updateCombatLog } = combatLog.actions

// Selector functions
export const selectCombatLog = (state, id) =>
  // console.log(state, id)
  Utils.getObjValue(state.combatLog, id) || []

export default combatLog.reducer
