// Import core components
import { createContext, useEffect } from 'react'

// Import our Components
import { WS } from 'toolkits'

const Context = createContext()
const ws = WS()

/**
 * Websocket Provider Component
 *
 * @param {object} properties
 * @returns {React.FunctionComponentElement} React.FunctionComponentElement
 */
function Provider(properties) {
  // ComponentDidMount equivalent
  useEffect(() => {
    ws.connect()

    // ComponentWillUnmount equivalent
    return () => ws.disconnect(true)
  })

  return <Context.Provider value={ws} {...properties} />
}

export { Context as WebSocket }
export default Provider
