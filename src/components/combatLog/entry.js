// Import core components
import { useCallback } from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import classNames from 'classnames'

// Import Styling
// ...

// Import our components
import * as Utils from 'toolkits/utils'
import { url } from 'toolkits/xivapi'

function format(entry) {
  const message = entry.message.split('@').map((part) => {
    if (!part.length) return false
    if (!entry.entities[part]) return part

    return (
      <span className={`text-${Utils.getObjValue(entry.entities[part], 'job.shortName')}`}>
        <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-job">{Utils.getObjValue(entry.entities[part], 'job.displayName')}</Tooltip>}>
          <img className="job-icon" src={`${url}/${Utils.getObjValue(entry.entities[part], 'job.icon')}`} />
        </OverlayTrigger>
        {Utils.getObjValue(entry.entities[part], 'combatant.actorName')}
      </span>
    )
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
