// Import core components
import { createContext } from 'react'
import { useLocation } from 'react-router-dom'

// Import our Components
import { WS } from 'toolkits'
import { useEffectOnce } from 'components/hooks'

const Context = createContext()

/**
 * Websocket Provider Component
 *
 * @param {object} properties
 * @returns {React.FunctionComponentElement} React.FunctionComponentElement
 */
function Provider(properties) {
  // Hooks
  const location = useLocation()
  // Toolkits
  const ws = WS(location.pathname)

  // ComponentDidMount equivalent
  useEffectOnce(() => {
    ws.connect()

    // ComponentWillUnmount equivalent
    return () => {
      ws.disconnect(true)
    }
  })

  return <Context.Provider value={ws} {...properties} />
}

export { Context as WebSocket }
export default Provider
