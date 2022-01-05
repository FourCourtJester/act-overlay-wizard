// Import core components
import { useEffect, useState } from 'react'
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
        [time, setTime] = useState(Date.now())

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
        let interval = setInterval(() => setTime(Date.now()), 1005)

        return () => {
            clearInterval(interval)
            interval = null
        }
    }, [])

    return (
        null
    )
}

export default WizardSundial
