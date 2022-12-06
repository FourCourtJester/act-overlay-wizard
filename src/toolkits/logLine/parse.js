const monsterJob = 'FF'

function _isMonster(obj) {
  return obj.actorJob === '00' && obj.ownerID === '0000'
}

/**
 * Change Zone
 * @param {Array} line
 * @returns {Object}
 * @see https://github.com/quisquous/cactbot/blob/4eb2d4a4802b8d1968c702b56d11cdb75f58f6cc/docs/LogGuide.md#line-01-0x01-changezone
 */
function changeZone(line) {
  const [event, ts, zoneID, zoneName, ..._] = line
  return { event: +event, ts, zoneID, zoneName }
}

/**
 * Change Player
 * @param {Array} line
 * @returns {Object}
 * @see https://github.com/quisquous/cactbot/blob/4eb2d4a4802b8d1968c702b56d11cdb75f58f6cc/docs/LogGuide.md#line-02-0x02-changeprimaryplayer
 */
function changePlayer(line) {
  const [event, ts, actorID, actorName, ..._] = line
  return { event: +event, ts, actorID, actorName }
}

/**
 * Add Combatant
 * @param {Array} line
 * @returns {Object}
 * @see https://github.com/quisquous/cactbot/blob/4eb2d4a4802b8d1968c702b56d11cdb75f58f6cc/docs/LogGuide.md#line-03-0x03-addcombatant
 */
function addCombatant(line) {
  const [
    event,
    ts,
    actorID,
    actorName,
    actorJob,
    actorLevel,
    ownerID,
    ownerWorldID,
    ownerWorldName,
    ,
    ,
    currentHP,
    maxHP,
    currentMP,
    maxMP,
    ,
    actorX,
    actorY,
    actorZ,
    actorFacing,
    ..._
  ] = line

  return {
    _entities: {
      actors: ['actor.ID', 'actor.Name', 'actor.Job', 'actor.Level'],
    },
    event: +event,
    ts,
    actorID,
    actorName,
    actorJob: _isMonster({ actorJob, ownerID }) ? monsterJob : actorJob,
    actorLevel,
    ownerID,
    ownerWorldID,
    ownerWorldName,
    currentHP,
    maxHP,
    currentMP,
    maxMP,
    actorX,
    actorY,
    actorZ,
    actorFacing,
  }
}

/**
 * Remove Combatant
 * @param {Array} line
 * @returns {Object}
 * @see https://github.com/quisquous/cactbot/blob/4eb2d4a4802b8d1968c702b56d11cdb75f58f6cc/docs/LogGuide.md#line-04-0x04-removecombatant
 */
function removeCombatant(line) {
  const [event, ts, actorID, actorName, actorJob, actorLevel, ownerID, ownerWorldID, ownerWorldName, ..._] = line
  return {
    __entities: {
      actors: ['actor.ID', 'actor.Name', 'actor.Job', 'actor.Level'],
    },
    event: +event,
    ts,
    actorID,
    actorName,
    actorJob: _isMonster({ actorJob, ownerID }) ? monsterJob : actorJob,
    actorLevel,
    ownerID,
    ownerWorldID,
    ownerWorldName,
  }
}

/**
 * Party Change
 * @param {Array} line
 * @returns {Object}
 * @see https://github.com/quisquous/cactbot/blob/4eb2d4a4802b8d1968c702b56d11cdb75f58f6cc/docs/LogGuide.md#line-11-0x0b-partylist
 */
function partyChange(line) {
  const [event, ts, partySize, ...rawPartyIDs] = line
  const partyIDs = rawPartyIDs.slice(0, +partySize)

  return { event: +event, ts, party: partyIDs.filter((player) => player.startsWith('10')) }
}

/**
 * Player Stat Change
 * @param {Array} line
 * @returns {Object}
 * @see https://github.com/quisquous/cactbot/blob/4eb2d4a4802b8d1968c702b56d11cdb75f58f6cc/docs/LogGuide.md#line-12-0x0c-playerstats
 */
// function playerStatChange(line) {
//   const [
//     event,
//     ts,
//     actorJob,
//     strength,
//     dexterity,
//     vitality,
//     intelligence,
//     mind,
//     piety,
//     attackPower,
//     directHit,
//     criticalHit,
//     magicPotency,
//     healingPotency,
//     determination,
//     skillSpeed,
//     spellSpeed,
//     ,
//     tenacity,
//     ..._
//   ] = line

//   return {
//     event,
//     ts,
//     actorJob,
//     strength,
//     dexterity,
//     vitality,
//     intelligence,
//     mind,
//     piety,
//     attackPower,
//     directHit,
//     criticalHit,
//     magicPotency,
//     healingPotency,
//     determination,
//     skillSpeed,
//     spellSpeed,
//     tenacity,
//   }
// }

/**
 * Action Casting
 * @param {Array} line
 * @returns {Object}
 * @see https://github.com/quisquous/cactbot/blob/4eb2d4a4802b8d1968c702b56d11cdb75f58f6cc/docs/LogGuide.md#line-20-0x14-networkstartscasting
 */
function actionCasting(line) {
  const [event, ts, actorID, actorName, actionID, actionName, targetID, targetName, castTime, actorX, actorY, actorZ, actorFacing, ..._] = line

  return {
    _entities: {
      actions: ['action.ID', 'action.Name'],
      actors: ['actor.ID', 'actor.Name'],
      targets: ['target.ID', 'target.Name'],
    },
    event: +event,
    ts,
    actorID,
    actorName,
    actionID,
    actionName,
    targetID,
    targetName,
    castTime,
    actorX,
    actorY,
    actorZ,
    actorFacing,
  }
}

/**
 * Action Castied
 * @param {Array} line
 * @returns {Object}
 * @see https://github.com/quisquous/cactbot/blob/4eb2d4a4802b8d1968c702b56d11cdb75f58f6cc/docs/LogGuide.md#line-21-0x15-networkability
 */
function actionCasted(line) {
  const [event, ts, actorID, actorName, actionID, actionName, targetID, targetName, resultFlags, result, ...rest] = line
  const flags = rest.slice(0, 13)
  const [
    targetCurrentHP,
    targetMaxHP,
    targetCurrentMP,
    targetMaxMP,
    ,
    ,
    targetX,
    targetY,
    targetZ,
    targetFacing,
    actorCurrentHP,
    actorMaxHP,
    actorCurrentMP,
    actorMaxMP,
    ,
    ,
    actorX,
    actorY,
    actorZ,
    actorFacing,
    ..._
  ] = rest.slice(14)

  return {
    _entities: {
      actions: ['action.ID', 'action.Name'],
      actors: ['actor.ID', 'actor.Name'],
      targets: ['target.ID', 'target.Name'],
    },
    event: +event,
    ts,
    actorID,
    actorName,
    actionID,
    actionName,
    targetID,
    targetName,
    resultFlags,
    result,
    flags,
    targetCurrentHP,
    targetMaxHP,
    targetCurrentMP,
    targetMaxMP,
    targetX,
    targetY,
    targetZ,
    targetFacing,
    actorCurrentHP,
    actorMaxHP,
    actorCurrentMP,
    actorMaxMP,
    actorX,
    actorY,
    actorZ,
    actorFacing,
  }
}

/**
 * Action Cancelled
 * @param {Array} line
 * @returns {Object}
 * @see https://github.com/quisquous/cactbot/blob/4eb2d4a4802b8d1968c702b56d11cdb75f58f6cc/docs/LogGuide.md#line-23-0x17-networkcancelability
 */
function actionCancelled(line) {
  const [event, ts, actorID, actorName, actionID, actionName, reason, ..._] = line
  return {
    _entities: {
      actions: ['action.ID', 'action.Name'],
      actors: ['actor.ID', 'actor.Name'],
    },
    event: +event,
    ts,
    actorID,
    actorName,
    actionID,
    actionName,
    reason,
  }
}

/**
 * HoT or DoT Tick
 * @param {Array} line
 * @returns {Object}
 * @see https://github.com/quisquous/cactbot/blob/4eb2d4a4802b8d1968c702b56d11cdb75f58f6cc/docs/LogGuide.md#line-24-0x18-networkdot
 */
function dotTick(line) {
  const [
    event,
    ts,
    actorID,
    actorName,
    effectType,
    effectID,
    effectResult,
    actorCurrentHP,
    actorMaxHP,
    actorCurrentMP,
    actorMaxMP,
    ,
    ,
    actorX,
    actorY,
    actorZ,
    actorFacing,
    ..._
  ] = line

  return {
    _entities: {
      actors: ['actor.ID', 'actor.Name'],
      effects: ['effect.ID', 'effect.Name'],
    },
    event: +event,
    ts,
    actorID,
    actorName,
    effectType,
    effectID,
    effectResult,
    actorCurrentHP,
    actorMaxHP,
    actorCurrentMP,
    actorMaxMP,
    actorX,
    actorY,
    actorZ,
    actorFacing,
  }
}

/**
 * Death
 * @param {Array} line
 * @returns {Object}
 * @see https://github.com/quisquous/cactbot/blob/4eb2d4a4802b8d1968c702b56d11cdb75f58f6cc/docs/LogGuide.md#line-25-0x19-networkdeath
 */
function death(line) {
  const [event, ts, actorID, actorName, sourceID, sourceName, ..._] = line
  return {
    _entities: {
      actors: ['actor.ID', 'actor.Name'],
      sources: ['source.ID', 'source.Name'],
    },
    event: +event,
    ts,
    actorID,
    actorName,
    sourceID,
    sourceName,
  }
}

/**
 * Gains Effect
 * @param {Array} line
 * @returns {Object}
 * @see https://github.com/quisquous/cactbot/blob/4eb2d4a4802b8d1968c702b56d11cdb75f58f6cc/docs/LogGuide.md#line-26-0x1a-networkbuff
 */
function gainEffect(line) {
  const [event, ts, effectID, effectName, effectDuration, sourceID, sourceName, actorID, actorName, , actorMaxHP, sourceMaxHP, ..._] = line
  return {
    _entities: {
      actors: ['actor.ID', 'actor.Name'],
      effects: ['effect.ID', 'effect.Duration', 'effect.Name'],
      sources: ['source.ID', 'source.Name'],
    },
    event: +event,
    ts,
    effectID,
    effectName,
    effectDuration,
    sourceID,
    sourceName,
    actorID,
    actorName,
    actorMaxHP,
    sourceMaxHP,
  }
}

/**
 * Gains Marker
 * @param {Array} line
 * @returns {Object}
 * @see https://github.com/quisquous/cactbot/blob/4eb2d4a4802b8d1968c702b56d11cdb75f58f6cc/docs/LogGuide.md#line-26-0x1a-networkbuff
 */
function gainMarker(line) {
  const [event, ts, actorID, actorName, iconField1, iconField2, markerID, ..._] = line
  return {
    _entities: {
      actors: ['actor.ID', 'actor.Name'],
      markers: ['marker.ID'],
    },
    event: +event,
    ts,
    actorID,
    actorName,
    iconField1,
    iconField2,
    markerID,
  }
}

/**
 * Lose Effect
 * @param {Array} line
 * @returns {Object}
 * @see https://github.com/quisquous/cactbot/blob/4eb2d4a4802b8d1968c702b56d11cdb75f58f6cc/docs/LogGuide.md#line-30-0x1e-networkbuffremove
 */
function loseEffect(line) {
  const [event, ts, effectID, effectName, , sourceID, sourceName, actorID, actorName, ..._] = line
  return {
    _entities: {
      actors: ['actor.ID', 'actor.Name'],
      effects: ['effect.ID', 'effect.Name'],
      sources: ['source.ID', 'source.Name'],
    },
    event: +event,
    ts,
    effectID,
    effectName,
    sourceID,
    sourceName,
    actorID,
    actorName,
  }
}

/**
 * Game Control
 * @param {Array} line
 * @returns {Object}
 * @see https://github.com/quisquous/cactbot/blob/4eb2d4a4802b8d1968c702b56d11cdb75f58f6cc/docs/LogGuide.md#line-33-0x21-network6d-actor-control
 */
function gameControl(line) {
  const [event, ts, instanceID, commandID, ...rawData] = line
  const data = rawData.slice(0, 4)

  return { event: +event, ts, instanceID, commandID, data }
}

/**
 * Gain Tether
 * @param {Array} line
 * @returns {Object}
 * @see https://github.com/quisquous/cactbot/blob/4eb2d4a4802b8d1968c702b56d11cdb75f58f6cc/docs/LogGuide.md#line-35-0x23-networktether
 */
function gainTether(line) {
  const [event, ts, sourceID, sourceName, actorID, actorName, , , tetherID, ..._] = line
  return {
    _entities: {
      actions: ['action.ID', 'action.Name'],
      actors: ['actor.ID', 'actor.Name'],
      sources: ['source.ID', 'source.Name'],
      tethers: ['tetherID'],
    },
    event: +event,
    ts,
    sourceID,
    sourceName,
    actorID,
    actorName,
    tetherID,
  }
}

export function parse(line) {
  const event = +line[0]

  switch (event) {
    // Change Zone
    case 1: {
      return changeZone(line)
    }

    // Change Character
    case 2: {
      return changePlayer(line)
    }

    // Add a Combatant
    case 3: {
      return addCombatant(line)
    }

    // Remove Combatant
    case 4: {
      return removeCombatant(line)
    }

    // Party Change
    case 11: {
      return partyChange(line)
    }

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
    // case 0:
    // case 12:
    // case 28:
    // case 29:
    // case 31:
    // case 32:
    // case 34:
    // case 36:
    // case 37:
    // case 38:
    // case 39:
    // case 41: {
    //   return {}
    // }

    // Unhandled
    default: {
      return {}
    }
  }
}
