// Import core components
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// Import our components
import { selectResting, updateRecast } from 'db/slices/spellbook'

// Import style
// ...

function WizardSundial() {
    const
        // Redux
        dispatch = useDispatch(),
        // Variables
        resting = useSelector(selectResting),
        [time, setTime] = useState(Date.now()),
        interval = useRef(null)

    useEffect(() => {
        if (Object.values(resting).length) {
            if (interval.current === null) {
                interval.current = setInterval(() => setTime(Date.now()), 1005)
            }
        } else {
            clearInterval(interval.current)
            interval.current = null
        }
    }, [resting])

    useEffect(() => {
        const updated_actions = Object.values({ ...resting }).reduce((actions, action) => {
            actions.push({
                id: action.id,
                recast: action.recast - 1
            })

            return actions
        }, [])

        dispatch(updateRecast(updated_actions))

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
