// Import core components
import { useCallback } from 'react'
import { OverlayTrigger, Popover, Tooltip } from 'react-bootstrap'
import parse from 'html-react-parser'
import store from 'db/store'

// Import Styling
// ...

// Import our components
import * as Utils from 'toolkits/utils'

function format(entry) {
  const state = store.getState()
  const message = entry.split('@').map((part) => {
    if (!part.length) return false
    if (part.indexOf('|') === -1) return part

    const [field, ...ids] = part.split('|')

    switch (field) {
      case 'action': {
        const action = state[field]?.[ids[0]]
        const hasDescription = action?.description
        const img = action?.icon

        if (!hasDescription)
          return (
            <span>
              {img && <img className="job-icon me-1" src={action.icon} />}
              <a className="text-decoration-underline text-light" href={`http://xivapi.com/Action/${Utils.h2d(action.id)}?pretty=1`} target={action.id}>
                {action?.displayName}
              </a>
            </span>
          )

        return (
          <OverlayTrigger
            placement="right"
            overlay={
              <Popover className="ffxiv-dialog p-1">
                <div className="inner-dialog px-2 py-1">
                  <div style={{ whiteSpace: 'pre-line' }}>{parse(action.description)}</div>
                </div>
              </Popover>
            }
          >
            <span>
              {img && <img className="job-icon me-1" src={action.icon} />}
              <a className="text-decoration-underline text-light" href={`http://xivapi.com/Action/${Utils.h2d(action.id)}?pretty=1`} target={action.id}>
                {action?.displayName}
              </a>
            </span>
          </OverlayTrigger>
        )
      }

      case 'combatant': {
        const combatant = state[field]?.[ids[0]]
        const job = state.job[combatant?.actorJob]
        const img = job?.icon

        return (
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip>
                Level {Utils.h2d(combatant?.actorLevel)} {job?.code}
              </Tooltip>
            }
          >
            <span>
              {img && <img className="job-icon me-1" src={job.icon} />}
              <span className={`text-${job?.code}`}>{combatant?.actorName}</span>
            </span>
          </OverlayTrigger>
        )
      }

      case 'effect': {
        const effect = state[field]?.[ids[0]]
        const hasDescription = effect?.description
        const img = effect?.icon

        if (!hasDescription)
          return (
            <span>
              {img && <img className="job-icon me-1" src={effect.icon} />}
              <a className="text-decoration-underline text-light" href={`http://xivapi.com/Status/${Utils.h2d(effect.id)}?pretty=1`} target={effect.id}>
                {effect?.displayName}
              </a>
            </span>
          )

        return (
          <OverlayTrigger
            placement="right"
            overlay={
              <Popover className="ffxiv-dialog p-1">
                <div className="inner-dialog px-2 py-1">
                  <div style={{ whiteSpace: 'pre-line' }}>{parse(effect.description)}</div>
                </div>
              </Popover>
            }
          >
            <span>
              {img && <img className="job-icon me-1" src={effect.icon} />}
              <a className="text-decoration-underline text-light" href={`http://xivapi.com/Status/${Utils.h2d(effect.id)}?pretty=1`} target={effect.id}>
                {effect?.displayName}
              </a>
            </span>
          </OverlayTrigger>
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
