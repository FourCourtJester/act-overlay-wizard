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
    const patch = '6.0'

    useEffect(() => {
        Storage.wipe(patch)
    }, [patch])

    return (
        <WebSocketProvider>
            <Sundial />
            <Spellbook />
            <Dynamis />
        </WebSocketProvider>
    )
}

export default WizardPage
