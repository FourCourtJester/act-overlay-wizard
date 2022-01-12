// Import core components
import { Suspense, useEffect } from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { useSelector } from 'react-redux'
import ErrorBoundary from 'ErrorBoundary'

// Import our components
import E404 from 'pages/404'
import Wizard from 'pages/Wizard'

import { selectVersion } from 'db/slices/version'

// Import style
// ...

function App() {
	const
		version = useSelector(selectVersion)

	useEffect(() => {
		console.log(`ACT Wizard v${version}`)
	}, [version])

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