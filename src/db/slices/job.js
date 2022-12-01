// Import core components
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

// Import our components
import { selectVersion } from 'db/slices/version'

import * as Storage from 'toolkits/storage'
import * as Utils from 'toolkits/utils'
import * as XIVAPI from 'toolkits/xivapi'

const name = 'job'
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

function _getJob(state, id) {
  return Utils.getObjValue(state.job, id)
}

export const updateJob = createAsyncThunk(`${name}/add`, async (id, api) => {
  const state = api.getState()
  const cachedJob = _getJob(state, id)
  const version = selectVersion(state)

  try {
    // Valid existing job
    if (cachedJob && cachedJob?.version === version) return cachedJob

    const newJob = await XIVAPI.get('ClassJob', Utils.h2d(id))

    // Job ID isn't a registered player job
    if (!newJob) throw new Error(null)

    return {
      ...newJob,
      id,
      version,
    }
  } catch (err) {
    return api.rejectWithValue(null)
  }
})

// Job Slice
export const job = createSlice({
  name: 'job',
  initialState: getState(),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(updateJob.fulfilled, (state, { payload }) => {
      state[payload.id] = payload
    })
  },
})

// Reducer functions
// export const { add: addJobEntry, remove: removeJobEntry } = job.actions

// Selector functions
export const selectJob = (state, id) => _getJob(state, id)

export default job.reducer
