// Import core components
import { Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ErrorBoundary from 'ErrorBoundary'

// Import our components
import _404 from 'pages/404'
import Wizard from 'pages/Wizard'
import Quill from 'pages/Quill'

import Actions from 'components/quill/Actions'
import Instances from 'components/quill/Instances'
import Jobs from 'components/quill/Jobs'

// Import style
// ...

function App() {
	return (
		<ErrorBoundary>
			<Suspense fallback={<p>Fallback</p>}>
				<Router>
					<Routes>
						<Route path="/backstage" element={<Quill />}>
							<Route path="actions" element={<Actions />} />
							<Route path="instances" element={<Instances />} />
							<Route path="jobs" element={<Jobs />} />
						</Route>
						<Route path="/" element={<Wizard />} />
						<Route path="*" element={<_404 />} />
					</Routes>
				</Router>
			</Suspense>
		</ErrorBoundary>
	)
}

export default App