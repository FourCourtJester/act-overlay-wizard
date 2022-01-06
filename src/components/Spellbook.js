// Import core components
import { useContext, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CSSTransition } from 'react-transition-group'

// Import our components
import { WebSocketContext } from 'contexts/WebSocket'
import { initYou, removeResting, selectResting, selectRestricted, selectParty, selectYou, updateParty } from 'db/slices/spellbook'
import { selectActions, updateAction } from 'db/slices/tome'

import { url as xivapi_url } from 'toolkits/xivapi'
// import * as Utils from 'toolkits/utils'

// Import style
// ...

function WizardSpellbook() {
    const
        // Redux
        dispatch = useDispatch(),
        // Context
        ws = useContext(WebSocketContext),
        // Variables
        recast_threshold = 3, // Number of seconds to pay attention to
        cache = {
            actions: useSelector(selectActions),
            party: useSelector(selectParty),
            restricted: useSelector(selectRestricted),
            you: useSelector(selectYou),
        },
        resting = useSelector(selectResting),
        // States
        [filtered_resting, setResting] = useState([]),
        [visible, setVisible] = useState(false),
        [action, setAction] = useState([]),
        [reset, setReset] = useState([]),
        // Ref
        $spellbook = useRef(null)

    useEffect(() => {
        // Subscribe to ChangePrimaryPlayer
        ws.on('ChangePrimaryPlayer', 'WizardSpellbook', ({ charID, charName }) => {
            dispatch(initYou(charName))
        })

        // Subscribe to PartyChanged
        ws.on('PartyChanged', 'WizardSpellbook', ({ party }) => {
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
                case 3:
                    setReset(line)
                    break
                case 21:
                case 22:
                    // parseAction(line)
                    setAction(line)
                    break
                default: break
            }
        })

        // Connect
        ws.connect()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ws])

    useEffect(() => {
        console.log('Change Primary Player:', cache.you)
    }, [cache.you])

    useEffect(() => {
        if (!action.length) return false

        // const [code, ts, source_id, source, id, name, target_id, target, ..._] = line
        const [, , , source, id, name, , , ..._] = action

        // Only look at your own spells for now
        if (source !== cache.you) return false

        // Ignore a safelist of abilities
        if (cache.restricted.includes(name.split('_')[0])) return false

        // If this action hasn't been seen before, update our references
        dispatch(updateAction(id))

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [action])

    useEffect(() => {
        if (!reset.length) return false

        // const [code, ts, source_id, source, job_id, level, ..._] = line
        const [, , , source, , , ..._] = reset

        // Only care if we changed classes
        if (source !== cache.you) return false

        // Remove all resting actions
        dispatch(removeResting())

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reset])

    useEffect(() => {
        const actions = Object.values(resting).reduce(
            (actions, action) => action.recast > recast_threshold
                ? actions
                : actions.concat([action])
            , [])

        setResting(actions.sort((a, b) => a.recast > b.recast ? 1 : a.recast < b.recast ? -1 : 0))
    }, [resting])

    useEffect(() => {
        setVisible(filtered_resting.length > 0)
    }, [filtered_resting.length])

    // Testing
    // useEffect(() => {
    //     parseAction(['21', '|', '|', 'Shekawa Phen', 'BC', 'Sacred Soil', '|', 'Shekawa Phen', '|'])
    //     parseAction(['21', '|', '|', 'Shekawa Phen', 'B9', 'Adloquium', '|', 'Shekawa Phen', '|'])
    // }, [])

    return (
        <div className="spellbook-wrap position-absolute d-flex flex-row justify-content-center align-items-center w-100">
            <CSSTransition ref={$spellbook} in={visible} timeout={375}>
                {/* Spellbook */}
                <div className="spellbook position-relative d-flex flex-row justify-content-center align-items-center p-2">
                    {filtered_resting.length > 0 && filtered_resting.map((action, i) => (
                        <span key={i} className="action-wrap position-relative d-flex">
                            <span className="action position-relative d-block w-100 h-100">
                                <img className="position-relative w-100 h-100" src={`${xivapi_url}${action.icon}`} alt={action.display_name} />
                                <var className="position-absolute text-center w-100">{action.recast}</var>
                            </span>
                        </span>
                    ))}
                </div>
            </CSSTransition>
        </div>
    )
}

export default WizardSpellbook
