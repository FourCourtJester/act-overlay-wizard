// Import core components
import { useCallback } from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import store from 'db/store'

// Import Styling
// ...

// Import our components
import * as Utils from 'toolkits/utils'
import { url } from 'toolkits/xivapi'

function format(entry) {
  const state = store.getState()
  const message = entry.split('@').map((part) => {
    if (!part.length) return false
    if (part.indexOf('|') === -1) return part

    const [field, ...ids] = part.split('|')

    switch (field) {
      case 'combatant': {
        const combatant = state[field]?.[ids[0]]
        const job = state.job[combatant?.actorJob]
        const img = job?.icon

        return (
          <>
            {img && (
              <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-job">{job?.displayName}</Tooltip>}>
                <img className="job-icon" src={`${url}/${job?.icon}`} />
              </OverlayTrigger>
            )}
            <span className={`text-${job?.shortName}`}>{combatant?.actorName}</span>
          </>
        )
      }

      default: {
        return part
      }
    }
  })

  return (
    <div className="d-flex align-items-center">
      <p className="m-0">{message}</p>
    </div>
  )
}

/**
 * Component: Combat Log Entry
 *
 * @param {object} properties
 * @returns {React.FunctionComponentElement} React.FunctionComponentElement
 */
export const CombatLogEntryComponent = (properties) => {
  const jsx = useCallback(() => format(properties.entry), [properties])
  return jsx()
}
