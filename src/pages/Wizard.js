// Import core components
// ...

// Import our components
import { WebSocketProvider } from 'contexts/WebSocket'

import Spellbook from 'components/Spellbook'
import Sundial from 'components/Sundial'
import Dynamis from 'components/Dynamis'

// Import style
// ...

function WizardPage() {
    return (
        <WebSocketProvider>
            <Sundial />
            <Spellbook />
            <Dynamis />
        </WebSocketProvider>
    )
}

export default WizardPage
