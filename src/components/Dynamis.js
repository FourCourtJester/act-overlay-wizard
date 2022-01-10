// Import core components
import { useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CSSTransition } from 'react-transition-group'

// Import our components
import { WebSocketContext } from 'contexts/WebSocket'
import { addStatus, removeStatus, selectInclusive } from 'db/slices/dynamis'
import { selectYou } from 'db/slices/spellbook'

import { url as xivapi_url } from 'toolkits/xivapi'

// Import style
// ...

function WizardDynamis() {
    const
        // Redux
        dispatch = useDispatch(),
        // Context
        ws = useContext(WebSocketContext),
        // Variables
        cache = {
            inclusive: useSelector(selectInclusive),
            you: useSelector(selectYou),
        },
        // States
        [status, setStatus] = useState([])

    useEffect(() => {
        // Subscribe to LogLine
        ws.on('LogLine', 'WizardDynamis', ({ line, rawLine: raw }) => {
            switch (+line[0]) {
                case 26: // Buff received
                case 30: // Buff removed
                    setStatus(line)
                    break
                default: break
            }
        })
    }, [ws])

    useEffect(() => {
        if (!status.length) return false

        // const [code, ts, effect_id, effect, duration, source_id, source, target_id, target, ..._] = line
        const [code, , id, , duration, , , , target, ..._] = status

        if (target !== cache.you) return false

        switch (+code) {
            case 26:
                // console.log(`${source} applied ${effect} to ${target} for ${duration}s`)
                dispatch(addStatus({ id, duration }))
                break

            case 30:
                // console.log(`${target} has lost ${effect} from ${source}`)
                dispatch(removeStatus(id))
                break

            default: break
        }
    }, [status])

    return (null)
}

export default WizardDynamis
