// Import our components
import store from 'db/store'
import * as Utils from 'toolkits/utils'

export function assignEntities(fields, msg) {
  const state = store.getState()
  const obj = {
    event: fields.event,
    entities: {},
    message: msg,
  }

  msg.split('@').forEach((part) => {
    if (!part.length) return part
    if (!fields[part]) return part

    switch (part) {
      // Players & Pets & NPCs
      case 'actorName':
      case 'sourceName':
      case 'targetName': {
        Utils.setObjValue(obj, `entities.${part}.combatant`, Utils.getObjValue(state, `combatant.${fields.actorID}`))
        Utils.setObjValue(obj, `entities.${part}.job`, Utils.getObjValue(state, `job.${fields.actorJob}`))
        break
      }

      // Actions
      case 'actionName': {
        break
      }

      // Effects
      case 'effectName': {
        break
      }

      // Markers
      case 'iconID': {
        break
      }

      // Tethers
      case 'tetherID': {
        break
      }

      default:
        break
    }
  })

  return obj
}
