// Import core components
import Promise from 'bluebird'
import axios from 'axios'

// Import our components
import * as Utils from 'toolkits/utils'

const _xivapi = {
  url: 'https://xivapi.com',
  public: 'http://xivapi.com',
  key: '3be1bf2c362b431a9a988372201d5c73271e2ee044a84611b2e3974f102dea7b',
  type: {
    action: 'Action',
  },
}

const customJobs = {
  // Pet
  0: {
    id: '00',
    icon: '/pet.png',
    displayName: 'Summon',
    code: 'PET',
    role: 0,
  },
  // Monster
  255: {
    id: 'FF',
    icon: '/monster.png',
    displayName: 'Monster',
    code: 'Monster',
    role: 255,
  },
}

function _url(str) {
  return `${[_xivapi.url, ...str].join('/')}?api_key=${_xivapi.key}`
}

function _format(str) {
  return str.replace(/(\n{3,})/gm, '\n\n').replace(/<br \/>+/gm, '')
}

function _replaceIcon(id, icon) {
  switch (id) {
    case 3: {
      return 'https://ffxiv.gamerescape.com/w/images/a/a8/Sprint_Icon.png'
    }

    default: {
      return icon
    }
  }
}

function _replaceAction(id) {
  return {
    id,
    icon: `/potion.png`,
    displayName: 'Item',
    description: false,
  }
}

async function _getAction(id) {
  return axios
    .get(_url(['Action', id]))
    .then((response) => ({
      id: response.data.ID,
      icon: _replaceIcon(response.data.ID, `${_xivapi.url}${response.data.IconHD}`),
      displayName: response.data.Name_en || 'Unknown Action',
      description: _format(response.data.Description_en) || false,
      // jobs: response.data.ClassJobCategory.Name_en.split(' '),
      // recast: response.data.Recast100ms / 10,
      // duration: response.data.Description_en ? +response.data.Description_en.match(/Duration:<\/span>\s(\d+)s/)?.[1] : 0,
    }))
    .catch((err) => {
      console.error(err)
      throw err
    })
}

async function _getClassJob(id) {
  if (Object.keys(customJobs).includes(String(id))) return customJobs[id]

  return axios
    .get(_url(['ClassJob', id]))
    .then((response) => ({
      id: response.data.ID,
      icon: `${_xivapi.url}${response.data.Icon}`,
      displayName: Utils.capitalize(response.data.Name_en),
      code: response.data.Abbreviation_en,
      role: response.data.Role,
    }))
    .catch((err) => {
      console.error(err)
      throw err
    })
}

async function _getEffect(id) {
  return axios
    .get(_url(['Status', id]))
    .then((response) => ({
      id: response.data.ID,
      icon: `${_xivapi.url}${response.data.IconHD}`,
      displayName: response.data.Name_en || 'Unknown Effect',
      description: _format(response.data.Description_en) || false,
    }))
    .catch((err) => {
      console.error(err)
      throw err
    })
}

export const url = _xivapi.public

export function get(type, id) {
  switch (type) {
    case 'Action':
      return Promise.resolve(true)
        .then(() => _getAction(id))
        .catch((err) => _replaceAction(id))
    case 'ClassJob': {
      return Promise.resolve(true).then(() => _getClassJob(id))
    }
    case 'Effect':
      return Promise.resolve(true).then(() => _getEffect(id))
    default:
      return null
  }
}
