// Import core components
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

// Import our components
import App from 'App'
import store from 'db/store'

// Import style
import 'scss/bootstrap.scss'
import 'scss/wizard.scss'

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('app')
)