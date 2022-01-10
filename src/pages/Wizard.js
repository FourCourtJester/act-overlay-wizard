// Import core components
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// Import our components
import { WebSocketProvider } from 'contexts/WebSocket'
import { initVersion } from 'db/slices/version'
import { initRestricted } from 'db/slices/spellbook'
import { initRecast } from 'db/slices/tome'
import { initInclusive } from 'db/slices/dynamis'

import Spellbook from 'components/Spellbook'
import Sundial from 'components/Sundial'
import Dynamis from 'components/Dynamis'

// Import style
// ...

function WizardPage() {
    const
        // Redux
        dispatch = useDispatch()

    // Check for Lock status from OverlayPlugin.dll
    useEffect(() => {
        document.addEventListener('onOverlayStateUpdate', (e) => {
            // console.log(e)

            if (e.detail.isLocked) {
                document.body.classList.add('locked')
                document.body.classList.remove('unlocked')
            } else {
                document.body.classList.add('unlocked')
                document.body.classList.remove('locked')
            }
        })
    }, [])

    // Check for version changes from FFXIV
    useEffect(() => {
        dispatch(initVersion())
        dispatch(initRestricted())
        dispatch(initRecast())
        dispatch(initInclusive())

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <WebSocketProvider>
            <Sundial />
            <Dynamis />
            <Spellbook />
        </WebSocketProvider>
    )
}

export default WizardPage
