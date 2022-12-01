// Import core components
import { useSelector } from 'react-redux'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'

// Import our components
import { useEffectOnce } from 'components/hooks'
import { selectVersion } from 'db/slices/version'
import { FFXIVRoute } from 'routes'
import { CombatLog } from 'pages'

// Import style
import 'scss/base.scss'

function App() {
  const version = useSelector(selectVersion)

  useEffectOnce(() => {
    console.log(`ACT Wizard v${version}`)
  }, [version])

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
