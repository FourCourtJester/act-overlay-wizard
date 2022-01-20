// Asphodelos: The First Circle (Savage)
// Import core components
import { useContext, useEffect, useRef, useState } from 'react'

// Import our components
import { WebSocketContext } from 'contexts/WebSocket'

import Tankbuster from 'encounters/templates/Tankbuster'

import * as Utils from 'toolkits/utils'

// Import style
// ...

function WizardEncounter(props) {
    const
        // Context
        ws = useContext(WebSocketContext),
        // Variables
        encounter = {
            actions: {
                '6629': { component: Tankbuster, description: 'Tankbuster' },
                '6625': { description: 'Spread' },
                '662A': { description: 'Raidbuster' }
            },
            enemies: ['4001268B'],
            markers: {},
            statuses: {},
            tethers: {}
        },
        // States
        [message, setMessage] = useState({}),
        // Refs
        $message = useRef(null)

    function parseAction(line) {
        // [14, 12:00:00, 4001268B, Erichthonios, 6629 ,Heavy Hand, 106A4BA8, Lil Slaughterer, 4.70]
        const [code, timestamp, character_id, character_name, action_id, action_name, target_id, target_name, decimal_action_cast, ..._] = line

        if (!encounter.actions?.[action_id] || !encounter.enemies.includes(character_id)) return false

        // Trackable action
        setMessage({
            action: action_name,
            attributes: encounter.actions[action_id],
            target: target_name,
            timeout: Math.ceil(decimal_action_cast),
        })
    }

    useEffect(() => {
        // Subscribe to LogLine
        ws.on('LogLine', 'WizardSpellbook', ({ line, rawLine: raw }) => {
            switch (+line[0]) {
                // Upcoming action
                case 20:
                    parseAction(line)
                    break

                // Status added
                case 26: break

                // Boss added marker
                case 27: break

                // Tether
                case 35: break
                default: break
            }
        })
    }, [ws])

    useEffect(() => {
        if (!Object.keys(message).length) return false

        const
            Component = message.attributes.component,
            t = setTimeout(() => {
                props.setVisible(false)
            }, message.timeout * 1000)

        $message.current = <Component message={message} setVisible={props.setVisible} />

        props.setVisible(true)

        return () => {
            clearTimeout(t)
        }

    }, [message])

    // Testing
    useEffect(() => {
        parseAction([20, '12:00:00', '4001268B', 'Erichthonios', '6629', 'Heavy Hand', '106A4BA8', 'Lil Slaughterer', 4.70])
    }, [])

    return (
        $message.current
    )
}

export default WizardEncounter
