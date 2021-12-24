// Import core components
import { useContext, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// Import our components
import { WebSocketContext } from 'contexts/WebSocket'
import { initActions, initYou, selectActions, selectParty, selectYou, updateParty } from 'db/slices/spellbook'
import * as Utils from 'toolkits/utils'

import actions_list from 'data/actions'

// Import style
// ...

function WizardSpellbook() {
    const
        // Redux
        dispatch = useDispatch(),
        cache = {
            actions: useSelector(selectActions),
            party: useSelector(selectParty),
            you: useSelector(selectYou),
        },
        ws = useContext(WebSocketContext)

    function parseAction(line) {
        const [, , , source, id, action, , target, ..._] = line
        // console.log(`${source}: ${action} (${parseInt(id, 16)}) on ${target}`)

        // Only look at your own spells for now
        if (source !== cache.you) return false

        // Action has a cooldown
        if (Utils.getObjValue(cache.actions, `${id}.cooldown`)) {
            // Add action to queue
            console.log(`${action} will refresh in ${cache.actions[id].cooldown} seconds.`)
            setTimeout(() => {
                console.log(`${action} is ready.`)
            }, cache.actions[id].cooldown * 1000)
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

    useEffect(() => {
        dispatch(initActions(actions_list))
    }, [])

    return (
        <p>Foo</p>
    )
}

export default WizardSpellbook
