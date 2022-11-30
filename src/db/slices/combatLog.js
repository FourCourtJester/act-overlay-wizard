// Import core components
import { createSlice } from '@reduxjs/toolkit'

// Import our components
import * as Utils from 'toolkits/utils'

const initialState = {
  entries: {},
}

// CombatLog Slice
export const combatLog = createSlice({
  name: 'combatLog',
  initialState: {
    obj: initialState,
  },
  reducers: {
    add: (state, action) => {
      // console.log('Create Combat Log: ', action.payload)
      Utils.setObjValue(state.obj.entries, action.payload, [])
    },
    update: (state, action) => {
      const log = Utils.getObjValue(state.obj.entries, action.payload.id)
      if (log) log.push(action.payload.entry)
    },
  },
})

// Reducer functions
export const { add: addCombatLogEntry, update: updateCombatLogEntry } = combatLog.actions

// Selector functions
export const selectCombatLogEntry = (state, id) => {
  console.log(state, id)
  return Utils.getObjValue(state.combatLog.obj.entries, id) || []
}

export default combatLog.reducer
