// Import core components
import { useContext, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ViewportList } from 'react-viewport-list'
import { nanoid } from 'nanoid'

// Import our components
import { WebSocket } from 'contexts'
import { addCombatLogEntry, selectCombatLogEntry, updateCombatLogEntry } from 'db/slices/combatLog'
import { format, parse } from 'toolkits/logLine'
import { useEffectOnce } from 'components/hooks'

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
  // Variables
  const combatLogID = useRef(nanoid(3))
  // Hooks
  const dispatch = useDispatch()
  // Redux
  const combatLog = useSelector((state) => selectCombatLogEntry(state, combatLogID.current))
  // Refs
  const $log = useRef(null)
  const $scroll = useRef(null)

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
        success: ({ line }) => {
          const event = +line[0]
          switch (event) {
            case 20:
            case 21:
            case 22:
            case 23:
            case 24:
            case 25:
            case 26:
            case 27:
            case 30:
            case 33:
            case 35: {
              const data = parse(event, line)
              const msg = format(event, data)

              dispatch(updateCombatLogEntry({ id: combatLogID.current, entry: msg }))
              break
            }

            default: {
              break
            }
          }
        },
      },
    })

    return () => {
      ws.off('connect', ['CombatLog'])
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ws])

  useEffect(() => {
    // TODO: Trigger a scroll upon becoming scrollable. Then stop triggering.
    // if ($scroll.current.clientHeight < $scroll.current.scrollHeight) $scroll.current.scroll(0, $scroll.current.scrollHeight)
  }, [combatLog])

  useEffectOnce(() => {
    dispatch(addCombatLogEntry(combatLogID.current))
  })

  return (
    <div id="combat-log" className="page-wrap d-flex p-1 w-100 h-100">
      <div className="ffxiv-dialog w-100 p-1 h-100">
        <div className="inner-dialog d-flex flex-column px-2 py-1 w-100 h-100">
          <h5 className="m-0">Combat Log</h5>
          <hr className="mx-0 mt-2 mb-0" />
          <div ref={$scroll} className="scrollbar">
            <ViewportList initialAlignToTop={false} overflowAnchor="none" items={combatLog} ref={$log} viewportRef={$scroll}>
              {(entry, i) => <div key={i}>{entry}</div>}
            </ViewportList>
            <div id="anchor" />
          </div>
        </div>
      </div>
    </div>
  )
}

// Exported Component for use
export default CombatLog
