// Import core components
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

// Import our components
import { selectVersion } from 'db/slices/version'

import * as Storage from 'toolkits/storage'
import * as Utils from 'toolkits/utils'
import * as XIVAPI from 'toolkits/xivapi'

const name = 'action'
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

function _getAction(state, id) {
  return Utils.getObjValue(state.action, id)
}

export const updateAction = createAsyncThunk(`${name}/update`, async (data, api) => {
  if (!data || !data?.actionID) throw new Error()

  const state = api.getState()
  const cachedAction = _getAction(state, data?.actionID)
  const version = selectVersion(state)

  try {
    // Valid existing action
    if (cachedAction && cachedAction?.version === version) return cachedAction

    const newAction = await XIVAPI.get('Action', Utils.h2d(data.actionID))

    // Action ID isn't a registered player action
    if (!newAction) throw new Error(null)

    return {
      ...newAction,
      id: data.actionID,
      version,
    }
  } catch (err) {
    return api.rejectWithValue(null)
  }
})

// Action Slice
export const action = createSlice({
  name: 'action',
  initialState: _getState(),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(updateAction.fulfilled, (state, { payload }) => {
      state[payload.id] = payload
    })
  },
})

// Reducer functions
// export const { add: addActionEntry, remove: removeActionEntry } = action.actions

// Selector functions
export const selectAction = (state, id) => _getAction(state, id)

export default action.reducer
