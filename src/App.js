// Import core components
import { HashRouter as Router, Routes, Route } from 'react-router-dom'

// Import our components
import { FFXIVRoute } from 'routes'
import { CombatLog } from 'pages'

// Import style
import 'scss/base.scss'

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<FFXIVRoute />}>
          <Route exact path="/" element={<CombatLog />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
