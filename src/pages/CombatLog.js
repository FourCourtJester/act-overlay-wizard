// Import core components
import { useContext, useEffect, useState } from 'react'

// Import our components
import { WebSocket } from 'contexts'
import * as Utils from 'toolkits/utils'

// Import style
// ...

/**
 * Page: Landing
 *
 * @returns {React.FunctionComponentElement} React.FunctionComponentElement
 */
function CombatLog() {
  // Contexts
  const ws = useContext(WebSocket)

  useEffect(() => {
    ws.on('connect', {
      CombatLog: {
        success: () => {
          console.log('Connected!')
          ws.send({
            call: 'subscribe',
            events: [
              // "onOverlayDataUpdate",
              // 'ChangePrimaryPlayer',
              // 'ChangeZone',
              // 'CombatData',
              // "EnmityAggroList",
              // "EnmityTargetData",
              // "GetCombatants",
              'LogLine',
              // 'PartyChanged',
              // "SendCharName",
            ],
          })
        },
      },
    })

    ws.on('LogLine', {
      CombatLog: {
        success: ({ line: data }) => {
          console.log(data)
        },
      },
    })

    return () => {
      ws.off('connect', ['CombatLog'])
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ws])

  return (
    <div className="page-wrap d-flex w-100 h-100 p-1">
      <div className="ffxiv-dialog w-100 h-100 p-1">
        <div className="inner-dialog scrollbar d-flex flex-column px-2 py-1 w-100 h-100">
          <h5>Combat Log</h5>
        </div>
      </div>
    </div>
  )
}

// Exported Component for use
export default CombatLog
