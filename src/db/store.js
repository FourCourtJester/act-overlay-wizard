// Import core components
import { configureStore } from '@reduxjs/toolkit'

// Import our components
import * as Storage from 'toolkits/storage'

import combatantReducer from './slices/combatant'
import combatLogReducer from './slices/combatLog'
import jobReducer from './slices/job'
import versionReducer from './slices/version'

const initialState = {}
const store = configureStore({
  preloadedState: initialState,
  reducer: {
    combatant: combatantReducer,
    combatLog: combatLogReducer,
    job: jobReducer,
    version: versionReducer,
  },
})

store.subscribe(() => Storage.set('redux', store.getState()))

export default store
