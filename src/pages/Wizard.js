// Import core components
// ...

// Import our components
import { WebSocketProvider } from 'contexts/WebSocket'

import Spellbook from 'components/Spellbook'
import Dynamis from 'components/Dynamis'

// Import style
// ...

function WizardPage() {
    return (
        <WebSocketProvider>
            <Spellbook />
            <Dynamis />
        </WebSocketProvider>
    )
}

export default WizardPage
