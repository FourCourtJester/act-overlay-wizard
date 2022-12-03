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

function _url(str) {
  return `${[_xivapi.url, ...str].join('/')}?api_key=${_xivapi.key}`
}

function _jobPet() {
  return {
    id: 0,
    icon: '/pet.png',
    displayName: 'Summon',
    shortName: 'PET',
    role: 0,
  }
}

async function _getAction(id) {
  return axios
    .get(_url(['Action', id]))
    .then((response) => ({
      id: response.data.ID,
      icon: `${_xivapi.url}${response.data.IconHD}`,
      displayName: response.data.Name_en,
      description: response.data.Description_en,
      // jobs: response.data.ClassJobCategory.Name_en.split(' '),
      // recast: response.data.Recast100ms / 10,
      // duration: response.data.Description_en ? +response.data.Description_en.match(/Duration:<\/span>\s(\d+)s/)?.[1] : 0,
    }))
    .catch((err) => {
      console.log(err)
    })
}

async function _getClassJob(id) {
  return axios
    .get(_url(['ClassJob', id]))
    .then((response) => {
      if (id > 0)
        return {
          id: response.data.ID,
          icon: `${_xivapi.url}${response.data.Icon}`,
          displayName: Utils.capitalize(response.data.Name_en),
          code: response.data.Abbreviation_en,
          role: response.data.Role,
        }

      return _jobPet()
    })
    .catch((err) => {
      console.log(err)
    })
}

async function _getEffect(id) {
  return axios
    .get(_url(['Status', id]))
    .then((response) => ({
      id: response.data.ID,
      icon: `${_xivapi.url}${response.data.IconHD}`,
      displayName: response.data.Name_en,
      description: response.data.Description_en,
      // jobs: response.data.ClassJobCategory.Name_en.split(' '),
      // recast: response.data.Recast100ms / 10,
      // duration: response.data.Description_en ? +response.data.Description_en.match(/Duration:<\/span>\s(\d+)s/)?.[1] : 0,
    }))
    .catch((err) => {
      console.log(err)
    })
}

export const url = _xivapi.public

export function get(type, id) {
  switch (type) {
    case 'Action':
      return Promise.resolve(true).then(() => _getAction(id))
    case 'ClassJob':
      return Promise.resolve(true).then(() => _getClassJob(id))
    case 'Effect':
      return Promise.resolve(true).then(() => _getEffect(id))
    default:
      return null
  }
}
