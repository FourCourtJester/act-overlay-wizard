// Import core components
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

// Import our components
import { selectVersion } from 'db/slices/version'
import { fixTags } from 'toolkits/logLine'

import * as Storage from 'toolkits/storage'
import * as Utils from 'toolkits/utils'
import * as XIVAPI from 'toolkits/xivapi'

const name = 'effect'
const initialState = {}

function _parse(description) {
  if (!description) return description

  return fixTags(description)
}

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

function _getEffect(state, id) {
  return Utils.getObjValue(state.effect, id)
}

export const updateEffect = createAsyncThunk(`${name}/update`, async (data, api) => {
  if (!data || !data?.effectID) throw new Error()

  const state = api.getState()
  const cachedEffect = _getEffect(state, data?.effectID)
  const version = selectVersion(state)

  try {
    // Valid existing effect
    if (cachedEffect && cachedEffect?.version === version) return cachedEffect

    const newEffect = await XIVAPI.get('Effect', Utils.h2d(data.effectID))

    // Effect ID isn't a registered player effect
    if (!newEffect) throw new Error(null)

    return {
      ...newEffect,
      id: data.effectID,
      description: _parse(newEffect?.description),
      version,
    }
  } catch (err) {
    return api.rejectWithValue(null)
  }
})

// Effect Slice
export const effect = createSlice({
  name: 'effect',
  initialState: _getState(),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(updateEffect.fulfilled, (state, { payload }) => {
      state[payload.id] = payload
    })
  },
})

// Reducer functions
// export const { add: addEffectEntry, remove: removeEffectEntry } = effect.effects

// Selector functions
export const selectEffect = (state, id) => _getEffect(state, id)

export default effect.reducer
