// Import core components
import { useEffect } from 'react'

// Import our components
import { WebSocketProvider } from 'contexts/WebSocket'

import Bestiary from 'components/Bestiary'
import Dynamis from 'components/Dynamis'
import Spellbook from 'components/Spellbook'
import Sundial from 'components/Sundial'

// Import style
// ...

function WizardPage() {
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

    return (
        <WebSocketProvider>
            <Sundial />
            <Dynamis />
            <Spellbook />
            <Bestiary />
        </WebSocketProvider>
    )
}

export default WizardPage
