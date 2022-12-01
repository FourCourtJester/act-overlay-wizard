// Import our components
import { assignEntities, parse } from 'toolkits/logLine'
import * as Utils from 'toolkits/utils'

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
//   return `Player changes to @actorName@`
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
  return assignEntities(obj, `@actorName@ has appeared somewhere nearby`)
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
  return assignEntities(obj, `@actorName@ has disappeared`)
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

  const message = selfCasted
    ? `@actorName@ begins to cast @actionName@ (@castTime@ seconds)`
    : `@actorName@ begins to cast @actionName@ on @targetName@ (@castTime@ seconds)`

  return assignEntities(obj, message)
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
  const message = selfCasted ? `@actorName@ casts @actionName@ on themselves` : `@actorName@ casts @actionName@ on @targetName@`
  return assignEntities(obj, message)
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
  return assignEntities(obj, `@actorName@ has @actionName@ @reason@`)
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

  return assignEntities(obj, `@actorName@ @action@ @effectResult@ @stat@`)
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
  return assignEntities(obj, `@actorName@ dies`)
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

  const message = selfCasted
    ? `@actorName@ gains the effect of @effectName@ for @effectDuration@ seconds`
    : `@actorName@ gains the effect of @effectName@ for @effectDuration@ seconds from @sourceName@`

  return assignEntities(obj, message)
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
  return assignEntities(obj, `@actorName@ gains the marker @iconID@`)
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
  const message = selfCasted ? `@actorName@ loses the effect of @effectName@` : `@actorName@ loses the effect of @effectName@ from @sourceName@`
  return assignEntities(obj, message)
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
  return assignEntities(obj, 'GameControl occured')
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
  return assignEntities(obj, `@actorName@ gains the tether @tetherID@ from @sourceName@`)
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
