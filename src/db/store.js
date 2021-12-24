// Import core components
import { configureStore } from '@reduxjs/toolkit'

// Import our components
import quillReducer from 'db/slices/quill'
import spellbookReducer from 'db/slices/spellbook'

export default configureStore({
  reducer: {
    quill: quillReducer,
    spellbook: spellbookReducer,
  }
})