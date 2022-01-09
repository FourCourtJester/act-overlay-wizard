// Import core components
import { configureStore } from '@reduxjs/toolkit'

// Import our components
// import quillReducer from 'db/slices/quill'
import spellbookReducer from 'db/slices/spellbook'
import tomeReducer from 'db/slices/tome'
import versionReducer from 'db/slices/version'

import * as Storage from 'toolkits/storage'

// Dev testing
// localStorage.removeItem('ffxiv.wizard.redux')

const
  initial_state = {},
  store = configureStore({
    preloadedState: Storage.get('redux') ? Storage.get('redux') : initial_state,
    reducer: {
      // quill: quillReducer,
      spellbook: spellbookReducer,
      tome: tomeReducer,
      version: versionReducer,
    }
  })

store.subscribe(() => Storage.set('redux', store.getState()))

export default store