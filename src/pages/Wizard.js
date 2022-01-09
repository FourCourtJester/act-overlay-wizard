// Import core components
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// Import our components
import { WebSocketProvider } from 'contexts/WebSocket'
import { checkVersion, selectVersion } from 'db/slices/version'

import Spellbook from 'components/Spellbook'
import Sundial from 'components/Sundial'
import Dynamis from 'components/Dynamis'

// Import style
// ...

function WizardPage() {
    const
        // Redux
        dispatch = useDispatch(),
        version = useSelector(selectVersion)

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
        dispatch(checkVersion(version))

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
