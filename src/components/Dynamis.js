// Import core components
import { useContext, useEffect } from 'react'

// Import our components
import { WebSocketContext } from 'contexts/WebSocket'

// Import style
// ...

function WizardDynamis() {
    const
        ws = useContext(WebSocketContext)

    function parseEffect(line) {
        // const [code, ts, effect_id, effect, duration, source_id, source, target_id, target, ..._] = line
        const [code, , , , , , , , , ..._] = line

        switch (+code) {
            case 26:
                // console.log(`${source} applied ${effect} to ${target} for ${duration}s`)
                break

            case 30:
                // console.log(`${target} has lost ${effect} from ${source}`)
                break

            default: break
        }
    }

    useEffect(() => {
        // Subscribe to LogLine
        ws.on('LogLine', 'WizardDynamis', ({ line, rawLine: raw }) => {
            switch (+line[0]) {
                case 26: // Buff received
                case 30: // Buff removed
                    parseEffect(line)
                    break
                default: break
            }
        })
    }, [ws])

    return (null)
}

export default WizardDynamis
