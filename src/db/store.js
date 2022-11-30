// Import core components
import { configureStore } from '@reduxjs/toolkit'

// Import our components
import combatLogReducer from './slices/combatLog'

export default configureStore({
  reducer: {
    combatLog: combatLogReducer,
  },
})
