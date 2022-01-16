// Import core components
import Promise from 'bluebird'
import axios from 'axios'

// Import our components
import { get as getIcon } from 'toolkits/icons'
import * as Utils from 'toolkits/utils'

const _xivapi = {
    key: '3be1bf2c362b431a9a988372201d5c73271e2ee044a84611b2e3974f102dea7b',
    public: 'http://xivapi.com',
    overrides: {
        // Sprint
        3: {
            icon: getIcon(`action.3`) // Can't find it on XIVApi at all
        },
    },
    type: {
        action: 'Action',
    },
    url: 'https://xivapi.com',
}

function _url(str) {
    return [_xivapi.url, ...str].join('/') + `?api_key=${_xivapi.key}`
}

async function _getAction(id) {
    return axios
        .get(_url(['Action', Utils.h2d(id)]))
        .then((response) => {
            return Promise
                .resolve(true)
                .delay(250)
                .then(() => {
                    return {
                        display_name: response.data.Name_en,
                        duration: response.data?.Description_en ? +(response.data.Description_en.match(/Duration:<\/span>\s(\d+)s/)?.[1]) || 0 : 0,
                        icon: [url, response.data.IconHD].join(''),
                        id: Utils.d2h(response.data.ID),
                        jobs: response.data.ClassJobCategory.Name_en.split(' '),
                        recast: response.data?.Recast100ms ? response.data.Recast100ms / 10 : 0,
                        uses_charges: response.data.MaxCharges > 0,
                        ...(Utils.getObjValue(_xivapi.overrides, response.data.ID) || {})
                    }
                })
        })
        .catch((err) => {
            console.error(err)
            return null
        })
}

async function _getStatus(id) {
    return axios
        .get(_url(['Status', Utils.h2d(id)]))
        .then((response) => {
            return Promise
                .resolve(true)
                .delay(250)
                .then(() => {
                    return {
                        display_name: response.data.Name_en,
                        has_duration: response.data.IsPermanent !== 1,
                        icon: `${url}${response.data.IconHD}`,
                        id: Utils.d2h(response.data.ID),
                        is_FC: response.data.IsFcBuff === 1,
                    }
                })
        })
        .catch((err) => {
            console.error(err)
            return null
        })
}

export const url = window.location.protocol === 'https:' ? _xivapi.url : _xivapi.public

export async function get(type, id) {
    return Promise
        .resolve(true)
        .then(() => {
            switch (type) {
                case 'action': return _getAction(id)
                case 'status': return _getStatus(id)
                default: return null
            }
        })
}