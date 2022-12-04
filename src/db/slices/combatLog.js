// Import core components
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

// Import our components
import { format, parse } from 'toolkits/logLine'

import * as Storage from 'toolkits/storage'
import * as Utils from 'toolkits/utils'

import { updateCombatant } from './combatant'
import { updateAction } from './action'
import { updateEffect } from './effect'

const name = 'combatLog'
const initialState = {}

function _getState() {
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

function reduce(entry, keys, prefix = false) {
  if (!keys || !keys.length) return false

  return keys.reduce((obj, _key) => {
    const splitKey = _key.split('.')
    const key = prefix ? [prefix].concat(splitKey.slice(1)).join('') : splitKey.join('')

    return {
      ...obj,
      [key]: entry[splitKey.join('')],
    }
  }, {})
}

export const updateCombatLog = createAsyncThunk(`${name}/update`, ({ id, line }, api) => {
  const entry = parse(line)

  try {
    if (!Object.keys(entry).length) throw new Error()
    if (!entry?._entities) throw new Error()

    const { actions, actors, effects, owners, marks, sources, targets, tethers } = entry._entities
    const promises = []

    // Actor entities
    promises.push(api.dispatch(updateCombatant(reduce(entry, actors, 'actor'))))
    promises.push(api.dispatch(updateCombatant(reduce(entry, owners, 'actor'))))
    promises.push(api.dispatch(updateCombatant(reduce(entry, sources, 'actor'))))
    promises.push(api.dispatch(updateCombatant(reduce(entry, targets, 'actor'))))

    // Action entities
    promises.push(api.dispatch(updateAction(reduce(entry, actions))))

    // Effect entities
    promises.push(api.dispatch(updateEffect(reduce(entry, effects))))

    return Promise.all(promises).then(() => ({ entry, id }))
  } catch (err) {
    return api.rejectWithValue(null)
  }
})

// CombatLog Slice
export const combatLog = createSlice({
  name: 'combatLog',
  initialState: _getState(),
  reducers: {
    add: (state, action) => {
      // console.log('Create Combat Log: ', action.payload)
      Utils.setObjValue(state, action.payload, [])
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateCombatLog.fulfilled, (state, action) => {
      const log = Utils.getObjValue(state, action.payload?.id)
      if (log) log.push(format(action.payload.entry))
    })
  },
})

// Reducer functions
export const { add: addCombatLog } = combatLog.actions

// Selector functions
export const selectCombatLog = (state, id) =>
  // console.log(state, id)
  Utils.getObjValue(state.combatLog, id) || []

export default combatLog.reducer
