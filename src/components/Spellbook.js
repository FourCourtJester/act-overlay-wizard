// Import core components
import { useContext, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Draggable from 'react-draggable'
import { CSSTransition } from 'react-transition-group'

// Import our components
import { WebSocketContext } from 'contexts/WebSocket'
import { initYou, clearResting, selectResting, selectRestricted, selectYou, updateResting } from 'db/slices/spellbook'
import { selectActions } from 'db/slices/tome'
import { selectComponent, updateDraggable } from 'db/slices/version'


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
            drag: useSelector((state) => selectComponent(state, 'spellbook')),
            restricted: useSelector(selectRestricted),
            you: useSelector(selectYou),
        },
        resting = useSelector(selectResting),
        // States
        [filtered_resting, setResting] = useState([]),
        [visible, setVisible] = useState(false),
        [locked, setLocked] = useState(false),
        [action, setAction] = useState([]),
        [redress, setRedress] = useState([]),
        [zone, setZone] = useState([]),
        // Ref
        $drag = useRef(null),
        $spellbook = useRef(null)

    function saveDrag(e, data) {
        dispatch(updateDraggable({ component: 'spellbook', x: data.x, y: data.y }))
    }

    useEffect(() => {
        // Subscribe to ChangePrimaryPlayer
        ws.on('ChangePrimaryPlayer', 'WizardSpellbook', ({ charID, charName }) => {
            dispatch(initYou(charName))
        })

        // Subscribe to PartyChanged
        // ws.on('PartyChanged', 'WizardSpellbook', ({ party }) => {
        //     dispatch(updateParty(party.reduce((list, member) => {
        //         list[member.name] = {
        //             id: member.id,
        //             job: member.job
        //         }

        //         return list
        //     }, {})))
        // })

        // Subscribe to ChangeZone
        ws.on('ChangeZone', 'WizardSpellbook', ({ zoneID, zoneName }) => {
            setZone(zoneID)
        })

        // Subscribe to LogLine
        ws.on('LogLine', 'WizardSpellbook', ({ line, rawLine: raw }) => {
            switch (+line[0]) {
                case 3:
                    setRedress(line)
                    break
                case 21:
                case 22:
                    setAction(line)
                    break
                default: break
            }
        })

        // Subscribe to CombatData
        ws.on('CombatData', 'WizardSpellbook', ({ isActive }) => {
            switch (isActive) {
                // Remove all resting actions
                case "false": dispatch(clearResting())
                    break
                default: break
            }
        })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ws])

    // Report Primary Player change
    // useEffect(() => {
    //     console.log('Change Primary Player:', cache.you)
    // }, [cache.you])

    // Parse the incoming Action
    useEffect(() => {
        if (!action.length) return false

        const [, , , character_name, action_id, action_name, ..._] = action

        // Only look at your own spells for now
        if (character_name !== cache.you) return false

        // Ignore a safelist of abilities
        if (cache.restricted.includes(action_name.toLowerCase().split('_')[0])) return false

        // Update our resting actions
        dispatch(updateResting(action_id))

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [action])

    // Class change, reset timers
    useEffect(() => {
        if (!redress.length) return false

        const [, , , character_name, ..._] = redress

        // Only care if we changed classes
        if (character_name !== cache.you) return false

        // Remove all resting actions
        dispatch(clearResting())

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [redress])

    // Zone change, reset timers
    useEffect(() => {
        // Remove all resting actions
        dispatch(clearResting())

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [zone])

    // Filter resting Actions for eminent recasting
    useEffect(() => {
        const actions = Object
            .values(resting)
            .reduce(
                (actions, action) => action.recast[0] > recast_threshold
                    ? actions
                    : actions.concat([action])
                , [])

        // Sort by recast ascending
        setResting(actions.sort((a, b) => a.recast[0] > b.recast[0] ? 1 : a.recast[0] < b.recast[0] ? -1 : 0))
    }, [resting])

    // Animate the chat bubble
    useEffect(() => {
        setVisible(filtered_resting.length > 0)
    }, [filtered_resting.length])

    // Check for Lock status from OverlayPlugin.dll
    useEffect(() => {
        document.addEventListener('onOverlayStateUpdate', (e) => {
            setLocked(e.detail.isLocked)
        })
    }, [])

    return (
        <Draggable nodeRef={$drag} disabled={locked} defaultPosition={{ x: cache.drag.x, y: cache.drag.y }} onStop={saveDrag}>
            <div ref={$drag} className="spellbook-wrap position-absolute d-flex flex-row justify-content-center align-items-center">
                <CSSTransition nodeRef={$spellbook} in={visible} timeout={375}>
                    {/* Spellbook */}
                    <div ref={$spellbook} className="spellbook position-relative d-flex flex-row justify-content-center align-items-center py-2 px-4">
                        {/* Actions */}
                        {filtered_resting.length > 0 && filtered_resting.map((action, i) => (
                            <span key={i} className="action position-relative d-block">
                                <img className="position-relative w-100 h-100" src={action.icon} alt={action.display_name} />
                                <var className="position-absolute text-center w-100">{action.recast[0]}</var>
                            </span>
                        ))}
                        <hr className="position-absolute" />
                    </div>
                </CSSTransition>
            </div>
        </Draggable>
    )
}

export default WizardSpellbook
