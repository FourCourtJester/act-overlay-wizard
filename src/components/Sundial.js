// Import core components
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// Import our components
import { selectResting, updateRecast } from 'db/slices/spellbook'
import { selectActive, updateDuration } from 'db/slices/dynamis'

// Import style
// ...

function WizardSundial() {
    const
        // Redux
        dispatch = useDispatch(),
        // Variables
        resting_actions = useSelector(selectResting),
        active_statuses = useSelector(selectActive),
        t = 1001,
        // States
        [time, setTime] = useState(Date.now()),
        // Refs
        interval = useRef(null)

    useEffect(() => {
        const entries = Object.values(resting_actions).length + Object.values(active_statuses).length

        if (entries > 0) {
            if (interval.current === null) {
                // console.log('Start Sundial')
                interval.current = setInterval(() => setTime(Date.now()), t)
            }
        } else {
            // console.log('End Sundial')
            clearInterval(interval.current)
            interval.current = null
        }
    }, [resting_actions, active_statuses])

    // Update resting actions
    useEffect(() => {
        const updated_actions = Object.values({ ...resting_actions }).reduce((actions, action) => {
            const
                _action = { id: action.id },
                recast = action.recast.slice(0, 1) - 1

            // Update the resting action timer
            actions.push({ ..._action, recast: [recast].concat(action.recast.slice(1)) })

            return actions
        }, [])

        dispatch(updateRecast(updated_actions))

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [time])

    // Update active statuses
    useEffect(() => {
        const updated_statuses = Object.values({ ...active_statuses }).reduce((statuses, status) => {
            console.log('Status', status.id, 'Duration', status.duration)

            statuses.push({
                id: status.id,
                duration: status.duration - 1
            })

            return statuses
        }, [])

        dispatch(updateDuration(updated_statuses))

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [time])

    useEffect(() => {
        return () => {
            clearInterval(interval.current)
            interval.current = null
        }
    }, [])

    return (
        null
    )
}

export default WizardSundial
