// Import core components
import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'

// Import our components
import { WebSocketProvider } from 'contexts'

// Import style
// ...

/**
 * Page: Combat Log
 *
 * @returns {React.FunctionComponentElement} React.FunctionComponentElement
 */
function FFXIVRoute() {
  // Check for Lock status from OverlayPlugin.dll
  useEffect(() => {
    document.addEventListener('onOverlayStateUpdate', (e) => {
      // console.log(e)

      if (e.detail.isLocked) {
        document.body.classList.add('locked')
        document.body.classList.remove('unlocked')
      } else {
        document.body.classList.add('unlocked')
        document.body.classList.remove('locked')
      }
    })
  }, [])

  return (
    <WebSocketProvider>
      <Outlet />
    </WebSocketProvider>
  )
}

// Exported Component for use
export default FFXIVRoute
