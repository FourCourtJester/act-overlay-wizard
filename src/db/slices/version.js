// Import core components
import { createSlice } from '@reduxjs/toolkit'

// Import our components
import * as Storage from 'toolkits/storage'
import * as Utils from 'toolkits/utils'

const name = 'version'
const initialState = {
  id: '6.20.a',
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

// Jobs Slice
export const version = createSlice({
  name,
  initialState: getState(),
})

// Reducer functions
// export const {} = version.actions

// Selector functions
export const selectVersion = (state) => state[name].id

export default version.reducer
