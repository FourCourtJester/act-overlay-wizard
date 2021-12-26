// Import core components
import { useContext, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// Import our components
import { WebSocketContext } from 'contexts/WebSocket'
import { initYou, selectResting, selectParty, selectYou, updateResting, updateParty } from 'db/slices/spellbook'
import { selectActions } from 'db/slices/tome'

import * as Utils from 'toolkits/utils'
import * as Keys from 'toolkits/keys'

// import actions_list from 'data/actions'

// Import style
// ...

function WizardSpellbook() {
    const
        // Redux
        dispatch = useDispatch(),
        // Context
        ws = useContext(WebSocketContext),
        // Variables
        cache = {
            actions: useSelector(selectActions),
            party: useSelector(selectParty),
            recast: 2.5,
            you: useSelector(selectYou),
        },
        resting = useSelector(selectResting),
        // Ref
        $spellbook = useRef(null)

    function parseAction(line) {
        const
            [code, , _source_id, source, _id, action, _target_id, target, ..._] = line,
            id = parseInt(_id, 16),
            recast = +Utils.getObjValue(cache.actions, `${id}.recast`)

        console.log(`${source}: ${action} (${id}) on ${target}`)

        // Only look at your own spells for now
        if (source !== cache.you) return false

        // Action has a recast timer
        if (recast > cache.recast) {
            // Add action to queue
            dispatch(updateResting(Utils.getObjValue(cache.actions, id)))
        }

        return true
    }

    useEffect(() => {
        // Subscribe to ChangePrimaryPlayer
        ws.on('ChangePrimaryPlayer', 'WizardSpellbook', ({ charID, charName }) => {
            dispatch(initYou(charName))
        })

        // Subscribe to PartyChanged
        ws.on('PartyChanged', 'WizardSpellbook', (party) => {
            dispatch(updateParty(party.reduce((list, member) => {
                list[member.name] = {
                    id: member.id,
                    job: member.job
                }

                return list
            }, {})))
        })

        // Subscribe to LogLine
        ws.on('LogLine', 'WizardSpellbook', ({ line, rawLine: raw }) => {
            switch (+line[0]) {
                case 21:
                case 22:
                    parseAction(line)
                    break
                default: break
            }
        })
    }, [ws])

    // Testing
    useEffect(() => {
        parseAction(['21', '|', '|', 'Shekawa Phen', 'BC', 'Sacred Soil', '|', 'Shekawa Phen', '|'])
        parseAction(['21', '|', '|', 'Shekawa Phen', 'B9', 'Adloquium', '|', 'Shekawa Phen', '|'])
    }, [])

    return (
        <>
            {/* Spellbook */}
            <div ref={$spellbook} className="spellbook position-absolute d-flex justify-content-center align-items-center p-2">
                {Object.values(resting).length > 0 && Object.values(resting).map((action, i) => (
                    <span className="action-wrap position-relative d-flex overflow-hidden">
                        <span className="action position-relative d-block overflow-hidden w-100 h-100">
                            <img key={i} className="position-relative w-100 h-100" src={`${Keys.get('xivapi.public')}${action.icon}`} alt={action.display_name} />
                        </span>
                    </span>
                ))}
            </div>
        </>
    )
}

export default WizardSpellbook
