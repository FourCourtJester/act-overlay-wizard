// Import core components
// ...

// Import our components
import { WebSocketProvider } from 'contexts/WebSocket'

import Spellbook from 'components/Spellbook'
import Sundial from 'components/Sundial'
import Dynamis from 'components/Dynamis'

import * as Storage from 'toolkits/storage'
import { useEffect } from 'react'

// Import style
// ...

function WizardPage() {
    const patch = '6.05'

    useEffect(() => {
        Storage.wipe(patch)
    }, [patch])

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
            <Spellbook />
            <Dynamis />
        </WebSocketProvider>
    )
}

export default WizardPage
