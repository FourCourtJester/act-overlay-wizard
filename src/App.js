// Import core components
import { Suspense } from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import ErrorBoundary from 'ErrorBoundary'

// Import our components
import E404 from 'pages/404'
import Wizard from 'pages/Wizard'
// import Quill from 'pages/Quill'

// import Actions from 'components/quill/Actions'
// import Instances from 'components/quill/Instances'
// import Jobs from 'components/quill/Jobs'

// Import style
// ...

function App() {
	console.log('ACT Wizard: Ready')

	return (
		<ErrorBoundary>
			<Suspense fallback={<p>Fallback</p>}>
				<Router>
					<Routes>
						{/* <Route path="/backstage" element={<Quill />}>
							<Route path="actions" element={<Actions />} />
							<Route path="instances" element={<Instances />} />
							<Route path="jobs" element={<Jobs />} />
						</Route> */}
						<Route exact path="/" element={<Wizard />} />
						<Route path="*" element={<E404 />} />
					</Routes>
				</Router>
			</Suspense>
		</ErrorBoundary>
	)
}

export default App