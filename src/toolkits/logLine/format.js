import * as Utils from 'toolkits/utils'

/**
 * Change Zone
 * @param {Object} obj
 * @returns {String}
 * @see https://github.com/quisquous/cactbot/blob/4eb2d4a4802b8d1968c702b56d11cdb75f58f6cc/docs/LogGuide.md#line-01-0x01-changezone
 */
function changeZone(obj) {
  // console.log('ChangeZone', ts, zoneID, zoneName)
  return `Zone has changed to ${obj.zoneName}`
}

/**
 * Change Player
 * @param {Object} obj
 * @returns {String}
 * @see https://github.com/quisquous/cactbot/blob/4eb2d4a4802b8d1968c702b56d11cdb75f58f6cc/docs/LogGuide.md#line-02-0x02-changeprimaryplayer
 */
function changePlayer(obj) {
  // console.log('ChangePlayer', ts, actorID, actorName)
  return `Player has changed to ${obj.actorName}`
}

/**
 * Add Combatant
 * @param {Object} obj
 * @returns {String}
 * @see https://github.com/quisquous/cactbot/blob/4eb2d4a4802b8d1968c702b56d11cdb75f58f6cc/docs/LogGuide.md#line-03-0x03-addcombatant
 */
function addCombatant(obj) {
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
  return `${obj.actorName} has been added somewhere nearby`
}

/**
 * Remove Combatant
 * @param {Object} obj
 * @returns {String}
 * @see https://github.com/quisquous/cactbot/blob/4eb2d4a4802b8d1968c702b56d11cdb75f58f6cc/docs/LogGuide.md#line-04-0x04-removecombatant
 */
function removeCombatant(obj) {
  // console.log('RemoveCombatant', ts, actorID, actorName, actorJob, actorLevel, ownerID, ownerWorldID, ownerWorldName)
  return `${obj.actorName} has been removed from play`
}

/**
 * Party Change
 * @param {Object} obj
 * @returns {String}
 * @see https://github.com/quisquous/cactbot/blob/4eb2d4a4802b8d1968c702b56d11cdb75f58f6cc/docs/LogGuide.md#line-11-0x0b-partylist
 */
function partyChange(obj) {
  // console.log('PartyChange', ts, partySize, ...partyIDs)
  return `Party size has changed to ${obj.partySize}`
}

/**
 * Player Stat Change
 * @param {Object} obj
 * @returns {String}
 * @see https://github.com/quisquous/cactbot/blob/4eb2d4a4802b8d1968c702b56d11cdb75f58f6cc/docs/LogGuide.md#line-12-0x0c-playerstats
 */
function playerStatChange(obj) {
  // console.log(
  //   'StatChanged',
  //   ts,
  //   actorJob,
  //   strength,
  //   dexterity,
  //   vitality,
  //   intelligence,
  //   mind,
  //   piety,
  //   attackPower,
  //   directHit,
  //   criticalHit,
  //   magicPotency,
  //   healingPotency,
  //   determination,
  //   skillSpeed,
  //   spellSpeed,
  //   tenacity
  // )
  return `Player stats have been modified`
}

/**
 * Action Casting
 * @param {Object} obj
 * @returns {String}
 * @see https://github.com/quisquous/cactbot/blob/4eb2d4a4802b8d1968c702b56d11cdb75f58f6cc/docs/LogGuide.md#line-20-0x14-networkstartscasting
 */
function actionCasting(obj) {
  // console.log('ActionCasting', ts, actorID, actorName, actionID, actionName, targetID, targetName, castTime, actorX, actorY, actorZ, actorFacing)
  return `${obj.actorName} has started to cast ${Utils.capitalize(obj.actionName)} on ${obj.targetName} in ${obj.castTime} seconds`
}

/**
 * Action Castied
 * @param {Object} obj
 * @returns {String}
 * @see https://github.com/quisquous/cactbot/blob/4eb2d4a4802b8d1968c702b56d11cdb75f58f6cc/docs/LogGuide.md#line-21-0x15-networkability
 */
function actionCasted(obj) {
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
  return `${obj.actorName} casts ${Utils.capitalize(obj.actionName)} on ${obj.targetName}`
}

/**
 * Action Cancelled
 * @param {Object} obj
 * @returns {String}
 * @see https://github.com/quisquous/cactbot/blob/4eb2d4a4802b8d1968c702b56d11cdb75f58f6cc/docs/LogGuide.md#line-23-0x17-networkcancelability
 */
function actionCancelled(obj) {
  // console.log('ActionCancelled', ts, actorID, actorName, actionID, actionName, reason)
  return `${obj.actorName} has had ${Utils.capitalize(obj.actionName)} ${obj.reason}`
}

/**
 * HoT or DoT Tick
 * @param {Object} obj
 * @returns {String}
 * @see https://github.com/quisquous/cactbot/blob/4eb2d4a4802b8d1968c702b56d11cdb75f58f6cc/docs/LogGuide.md#line-24-0x18-networkdot
 */
function dotTick(obj) {
  const action = obj.effectType === 'HoT' ? 'regains' : 'suffers'
  const stat = obj.effectType === 'HoT' ? 'health' : 'damage'

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
  return `${obj.actorName} ${action} ${Utils.h2d(obj.effectResult)} ${stat}`
}

/**
 * Death
 * @param {Object} obj
 * @returns {String}
 * @see https://github.com/quisquous/cactbot/blob/4eb2d4a4802b8d1968c702b56d11cdb75f58f6cc/docs/LogGuide.md#line-25-0x19-networkdeath
 */
function death(obj) {
  // console.log('Death', ts, actorID, actorName, sourceID, sourceName)
  return `${obj.actorName} has died`
}

/**
 * Gains Effect
 * @param {Object} obj
 * @returns {String}
 * @see https://github.com/quisquous/cactbot/blob/4eb2d4a4802b8d1968c702b56d11cdb75f58f6cc/docs/LogGuide.md#line-26-0x1a-networkbuff
 */
function gainEffect(obj) {
  const selfCasted = obj.sourceID === obj.actorID

  // console.log('GainEffect', ts, effectID, effectName, effectDuration, sourceID, sourceName, actorID, actorName, actorMaxHP, sourceMaxHP)
  return selfCasted
    ? `${obj.actorName} has gained the effects of ${obj.effectName} for ${Math.round(+obj.effectDuration)} seconds`
    : `${obj.actorName} has gained the effects of ${obj.effectName} for ${Math.round(+obj.effectDuration)} seconds from ${obj.sourceName}`
}

/**
 * Gains Marker
 * @param {Object} obj
 * @returns {String}
 * @see https://github.com/quisquous/cactbot/blob/4eb2d4a4802b8d1968c702b56d11cdb75f58f6cc/docs/LogGuide.md#line-26-0x1a-networkbuff
 */
function gainMarker(obj) {
  // console.log('GainMarker', ts, actorID, actorName, iconField1, iconField2, iconID)
  return `${obj.actorName} has gained the marker ${obj.iconID}`
}

/**
 * Lose Effect
 * @param {Object} obj
 * @returns {String}
 * @see https://github.com/quisquous/cactbot/blob/4eb2d4a4802b8d1968c702b56d11cdb75f58f6cc/docs/LogGuide.md#line-30-0x1e-networkbuffremove
 */
function loseEffect(obj) {
  // console.log('LoseEffect', ts, effectID, effectName, sourceID, sourceName, actorID, actorName)
  return `${obj.actorName} has lost the effects of ${obj.effectName} from ${obj.sourceName}`
}

/**
 * Game Control
 * @param {Object} obj
 * @returns {String}
 * @see https://github.com/quisquous/cactbot/blob/4eb2d4a4802b8d1968c702b56d11cdb75f58f6cc/docs/LogGuide.md#line-33-0x21-network6d-actor-control
 */
function gameControl(obj) {
  // console.log('GameControl', ts, instanceID, commandID, ...data)
  return 'GameControl occured'
}

/**
 * Gain Tether
 * @param {Object} obj
 * @returns {String}
 * @see https://github.com/quisquous/cactbot/blob/4eb2d4a4802b8d1968c702b56d11cdb75f58f6cc/docs/LogGuide.md#line-35-0x23-networktether
 */
function gainTether(obj) {
  // console.log('GainTether', ts, sourceID, sourceName, actorID, actorName, tetherID)
  return `${obj.actorName} has gained the tether ${obj.tetherID} from ${obj.sourceName}`
}

export function format(event, obj) {
  switch (event) {
    // Change Zone
    case 1: {
      return changeZone(obj)
    }

    // Change Character
    case 2: {
      return changePlayer(obj)
    }

    // Add a Combatant
    case 3: {
      return addCombatant(obj)
    }

    // Remove Combatant
    case 4: {
      return removeCombatant(obj)
    }

    // Party Change
    case 11: {
      return partyChange(obj)
    }

    // Player Stat Change
    case 12: {
      return playerStatChange(obj)
    }

    // Action Is Casting
    case 20: {
      return actionCasting(obj)
    }

    // Action
    // AoE Action
    case 21:
    case 22: {
      return actionCasted(obj)
    }

    // Action was Cancelled
    case 23: {
      return actionCancelled(obj)
    }

    // HoT or DoT entry
    case 24: {
      return dotTick(obj)
    }

    // Death
    case 25: {
      return death(obj)
    }

    // Buff or Debuff
    case 26: {
      return gainEffect(obj)
    }

    // Marker
    case 27: {
      return gainMarker(obj)
    }

    // Buff or Debuff removal
    case 30: {
      return loseEffect(obj)
    }

    // Game Control
    case 33: {
      return gameControl(obj)
    }

    // Tether
    case 35: {
      return gainTether(obj)
    }

    // Uninteresting LogLines
    // 00 - Chat Message
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
      break
    }

    // Unhandled
    default: {
      return 'Unknown event'
    }
  }
}
