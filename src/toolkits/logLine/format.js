// Import our components
import { parse } from 'toolkits/logLine'
import * as Utils from 'toolkits/utils'

function _f(field, obj) {
  switch (field) {
    // Players & Pets & NPCs
    case 'actorID':
    case 'sourceID':
    case 'targetID': {
      return `@combatant|${obj[field]}@`
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

    default: {
      break
    }
  }

  return obj[field]
}

/**
 * Change Zone
 * @param {Array} line
 * @returns {String}
 * @see https://github.com/quisquous/cactbot/blob/4eb2d4a4802b8d1968c702b56d11cdb75f58f6cc/docs/LogGuide.md#line-01-0x01-changezone
 */
// function changeZone(line) {
//   const obj = parse(line)

//   // console.log('ChangeZone', ts, zoneID, zoneName)
//   return `Zone changes to ${obj.zoneName}`
// }

/**
 * Change Player
 * @param {Array} line
 * @returns {String}
 * @see https://github.com/quisquous/cactbot/blob/4eb2d4a4802b8d1968c702b56d11cdb75f58f6cc/docs/LogGuide.md#line-02-0x02-changeprimaryplayer
 */
// function changePlayer(line) {
//   const obj = parse(line)

//   // console.log('ChangePlayer', ts, actorID, actorName)
//   return `Player changes to ${_f('actorID', obj)}`
// }

/**
 * Add Combatant
 * @param {Array} line
 * @returns {String}
 * @see https://github.com/quisquous/cactbot/blob/4eb2d4a4802b8d1968c702b56d11cdb75f58f6cc/docs/LogGuide.md#line-03-0x03-addcombatant
 */
function addCombatant(line) {
  const obj = parse(line)

  // console.log(
  //   'AddCombatant',
  //   ts,
  //   actorID,
  //   actorName,
  //   actorJob,
  //   actorLevel,
  //   ownerID,
  //   ownerWorldID,
  //   ownerWorldName,
  //   currentHP,
  //   maxHP,
  //   currentMP,
  //   maxMP,
  //   actorX,
  //   actorY,
  //   actorZ,
  //   actorFacing
  // )
  return `${_f('actorID', obj)} has appeared somewhere nearby`
}

/**
 * Remove Combatant
 * @param {Array} line
 * @returns {String}
 * @see https://github.com/quisquous/cactbot/blob/4eb2d4a4802b8d1968c702b56d11cdb75f58f6cc/docs/LogGuide.md#line-04-0x04-removecombatant
 */
function removeCombatant(line) {
  const obj = parse(line)

  // console.log('RemoveCombatant', ts, actorID, actorName, actorJob, actorLevel, ownerID, ownerWorldID, ownerWorldName)
  return `${_f('actorID', obj)} has disappeared`
}

/**
 * Party Change
 * @param {Array} line
 * @returns {String}
 * @see https://github.com/quisquous/cactbot/blob/4eb2d4a4802b8d1968c702b56d11cdb75f58f6cc/docs/LogGuide.md#line-11-0x0b-partylist
 */
// function partyChange(line) {
//   const obj = parse(line)

//   // console.log('PartyChange', ts, partySize, ...partyIDs)
//   return `Party changes to ${obj.partySize} members`
// }

/**
 * Player Stat Change
 * @param {Array} line
 * @returns {String}
 * @see https://github.com/quisquous/cactbot/blob/4eb2d4a4802b8d1968c702b56d11cdb75f58f6cc/docs/LogGuide.md#line-12-0x0c-playerstats
 */
// function playerStatChange(line) {
//   const obj = parse(line)

//   // console.log(
//   //   'StatChanged',
//   //   ts,
//   //   actorJob,
//   //   strength,
//   //   dexterity,
//   //   vitality,
//   //   intelligence,
//   //   mind,
//   //   piety,
//   //   attackPower,
//   //   directHit,
//   //   criticalHit,
//   //   magicPotency,
//   //   healingPotency,
//   //   determination,
//   //   skillSpeed,
//   //   spellSpeed,
//   //   tenacity
//   // )
//   return `Player stats change`
// }

/**
 * Action Casting
 * @param {Array} line
 * @returns {String}
 * @see https://github.com/quisquous/cactbot/blob/4eb2d4a4802b8d1968c702b56d11cdb75f58f6cc/docs/LogGuide.md#line-20-0x14-networkstartscasting
 */
function actionCasting(line) {
  const obj = parse(line)
  const selfCasted = obj.targetID === obj.actorID

  // console.log('ActionCasting', ts, actorID, actorName, actionID, actionName, targetID, targetName, castTime, actorX, actorY, actorZ, actorFacing)
  obj.castTime = Number(obj.castTime).toFixed(1)
  obj.actionName = Utils.capitalize(obj.actionName)

  return selfCasted
    ? `${_f('actorID', obj)} begins to cast ${_f('actionID', obj)} (${_f('castTime', obj)} seconds)`
    : `${_f('actorID', obj)} begins to cast ${_f('actionID', obj)} on ${_f('targetID', obj)} (${_f('castTime', obj)} seconds)`
}

/**
 * Action Castied
 * @param {Array} line
 * @returns {String}
 * @see https://github.com/quisquous/cactbot/blob/4eb2d4a4802b8d1968c702b56d11cdb75f58f6cc/docs/LogGuide.md#line-21-0x15-networkability
 */
function actionCasted(line) {
  const obj = parse(line)
  const selfCasted = obj.targetID === obj.actorID

  // console.log(
  //   'ActionCasted',
  //   ts,
  //   actorID,
  //   actorName,
  //   actionID,
  //   actionName,
  //   targetID,
  //   targetName,
  //   resultFlags,
  //   result,
  //   ...flags,
  //   targetCurrentHP,
  //   targetMaxHP,
  //   targetCurrentMP,
  //   targetMaxMP,
  //   targetX,
  //   targetY,
  //   targetZ,
  //   targetFacing,
  //   actorCurrentHP,
  //   actorMaxHP,
  //   actorCurrentMP,
  //   actorMaxMP,
  //   actorX,
  //   actorY,
  //   actorZ,
  //   actorFacing
  // )
  return selfCasted
    ? `${_f('actorID', obj)} casts ${_f('actionID', obj)} on themselves`
    : `${_f('actorID', obj)} casts ${_f('actionID', obj)} on ${_f('targetID', obj)}`
}

/**
 * Action Cancelled
 * @param {Array} line
 * @returns {String}
 * @see https://github.com/quisquous/cactbot/blob/4eb2d4a4802b8d1968c702b56d11cdb75f58f6cc/docs/LogGuide.md#line-23-0x17-networkcancelability
 */
function actionCancelled(line) {
  const obj = parse(line)

  // console.log('ActionCancelled', ts, actorID, actorName, actionID, actionName, reason)
  obj.reason = obj.reason.toLowerCase()
  return `${_f('actorID', obj)} has ${_f('actionID', obj)} ${_f('reason', obj)}`
}

/**
 * HoT or DoT Tick
 * @param {Array} line
 * @returns {String}
 * @see https://github.com/quisquous/cactbot/blob/4eb2d4a4802b8d1968c702b56d11cdb75f58f6cc/docs/LogGuide.md#line-24-0x18-networkdot
 */
function dotTick(line) {
  const obj = parse(line)

  // console.log(
  //   effectType,
  //   ts,
  //   actorID,
  //   actorName,
  //   effectType,
  //   effectID,
  //   effectResult,
  //   actorCurrentHP,
  //   actorMaxHP,
  //   actorCurrentMP,
  //   actorMaxMP,
  //   actorX,
  //   actorY,
  //   actorZ,
  //   actorFacing
  // )
  obj.action = obj.effectType === 'HoT' ? 'regains' : 'suffers'
  obj.stat = obj.effectType === 'HoT' ? 'health' : 'damage'
  obj.effectResult = Utils.h2d(obj.effectResult)

  return `${_f('actorID', obj)} ${_f('action', obj)} ${_f('effectResult', obj)} ${_f('stat', obj)}`
}

/**
 * Death
 * @param {Array} line
 * @returns {String}
 * @see https://github.com/quisquous/cactbot/blob/4eb2d4a4802b8d1968c702b56d11cdb75f58f6cc/docs/LogGuide.md#line-25-0x19-networkdeath
 */
function death(line) {
  const obj = parse(line)

  // console.log('Death', ts, actorID, actorName, sourceID, sourceName)
  return `${_f('actorID', obj)} dies`
}

/**
 * Gains Effect
 * @param {Array} line
 * @returns {String}
 * @see https://github.com/quisquous/cactbot/blob/4eb2d4a4802b8d1968c702b56d11cdb75f58f6cc/docs/LogGuide.md#line-26-0x1a-networkbuff
 */
function gainEffect(line) {
  const obj = parse(line)
  const selfCasted = obj.sourceID === obj.actorID

  // console.log('GainEffect', ts, effectID, effectName, effectDuration, sourceID, sourceName, actorID, actorName, actorMaxHP, sourceMaxHP)
  obj.effectDuration = Math.round(Number(obj.effectDuration)).toFixed(1)

  return selfCasted
    ? `${_f('actorID', obj)} gains the effect of ${_f('effectID', obj)} for ${_f('effectDuration', obj)} seconds`
    : `${_f('actorID', obj)} gains the effect of ${_f('effectID', obj)} for ${_f('effectDuration', obj)} seconds from ${_f('sourceID', obj)}`
}

/**
 * Gains Marker
 * @param {Array} line
 * @returns {String}
 * @see https://github.com/quisquous/cactbot/blob/4eb2d4a4802b8d1968c702b56d11cdb75f58f6cc/docs/LogGuide.md#line-26-0x1a-networkbuff
 */
function gainMarker(line) {
  const obj = parse(line)

  // console.log('GainMarker', ts, actorID, actorName, iconField1, iconField2, iconID)
  return `${_f('actorID', obj)} gains the marker ${_f('iconID', obj)}`
}

/**
 * Lose Effect
 * @param {Array} line
 * @returns {String}
 * @see https://github.com/quisquous/cactbot/blob/4eb2d4a4802b8d1968c702b56d11cdb75f58f6cc/docs/LogGuide.md#line-30-0x1e-networkbuffremove
 */
function loseEffect(line) {
  const obj = parse(line)
  const selfCasted = obj.sourceID === obj.actorID

  // console.log('LoseEffect', ts, effectID, effectName, sourceID, sourceName, actorID, actorName)
  return selfCasted
    ? `${_f('actorID', obj)} loses the effect of ${_f('effectID', obj)}`
    : `${_f('actorID', obj)} loses the effect of ${_f('effectID', obj)} from ${_f('sourceID', obj)}`
}

/**
 * Game Control
 * @param {Array} line
 * @returns {String}
 * @see https://github.com/quisquous/cactbot/blob/4eb2d4a4802b8d1968c702b56d11cdb75f58f6cc/docs/LogGuide.md#line-33-0x21-network6d-actor-control
 */
function gameControl(line) {
  const obj = parse(line)

  // console.log('GameControl', ts, instanceID, commandID, ...data)
  return 'GameControl occured'
}

/**
 * Gain Tether
 * @param {Array} line
 * @returns {String}
 * @see https://github.com/quisquous/cactbot/blob/4eb2d4a4802b8d1968c702b56d11cdb75f58f6cc/docs/LogGuide.md#line-35-0x23-networktether
 */
function gainTether(line) {
  const obj = parse(line)

  // console.log('GainTether', ts, sourceID, sourceName, actorID, actorName, tetherID)
  return `${_f('actorID', obj)} gains the tether ${_f('tetherID', obj)} from ${_f('sourceID', obj)}`
}

export function format(line) {
  const event = +line[0]

  switch (event) {
    // Change Zone
    // case 1: {
    //   return changeZone(line)
    // }

    // Change Character
    // case 2: {
    //   return changePlayer(line)
    // }

    // Add a Combatant
    case 3: {
      return addCombatant(line)
    }

    // Remove Combatant
    case 4: {
      return removeCombatant(line)
    }

    // Party Change
    // case 11: {
    //   return partyChange(line)
    // }

    // Player Stat Change
    // case 12: {
    //   return playerStatChange(line)
    // }

    // Action Is Casting
    case 20: {
      return actionCasting(line)
    }

    // Action
    // AoE Action
    case 21:
    case 22: {
      return actionCasted(line)
    }

    // Action was Cancelled
    case 23: {
      return actionCancelled(line)
    }

    // HoT or DoT entry
    case 24: {
      return dotTick(line)
    }

    // Death
    case 25: {
      return death(line)
    }

    // Buff or Debuff
    case 26: {
      return gainEffect(line)
    }

    // Marker
    case 27: {
      return gainMarker(line)
    }

    // Buff or Debuff removal
    case 30: {
      return loseEffect(line)
    }

    // Game Control
    case 33: {
      return gameControl(line)
    }

    // Tether
    case 35: {
      return gainTether(line)
    }

    // Uninteresting LogLines
    // 00 - Chat Message
    // 01 - Change Zone
    // 02 - Change Character
    // 11 - Party Change
    // 12 - Stat Change
    // 28 - Waymark
    // 29 - Sign
    // 31 - Job Gauge loss/gain
    // 32 - World (?)
    // 34 - NamePlate Toggle (May want to revisit later)
    // 36 - Limit Break loss/gain
    // 37 - Action Sync
    // 38 - NPC Effects
    // 39 - Batched HP Update
    // 41 - System Message
    case 0:
    case 1:
    case 2:
    case 11:
    case 12:
    case 28:
    case 29:
    case 31:
    case 32:
    case 34:
    case 36:
    case 37:
    case 38:
    case 39:
    case 41: {
      return false
    }

    // Unhandled
    default: {
      return `Unknown event [${event}]`
    }
  }
}
