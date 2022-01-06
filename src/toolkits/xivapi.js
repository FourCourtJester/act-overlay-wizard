// Import core components
import Promise from 'bluebird'
import axios from 'axios'

// Import our components
// import * as Utils from 'toolkits/utils'

const _xivapi = {
    url: 'https://xivapi.com',
    public: 'http://xivapi.com',
    key: '3be1bf2c362b431a9a988372201d5c73271e2ee044a84611b2e3974f102dea7b',
    type: {
        action: 'Action',
    },
}

function _url(str) {
    return [_xivapi.url, ...str].join('/') + `?api_key=${_xivapi.key}`
}

async function _getAction(id) {
    return axios
        .get(_url(['Action', id]))
        .then((response) => {
            return Promise
                .resolve(true)
                .delay(250)
                .then(() => {
                    return {
                        id: response.data.ID,
                        icon: response.data.IconHD,
                        display_name: response.data.Name_en,
                        jobs: response.data.ClassJobCategory.Name_en.split(' '),
                        recast: response.data.Recast100ms / 10,
                        duration: response.data.Description_en ? +(response.data.Description_en.match(/Duration:<\/span>\s(\d+)s/)?.[1]) : 0
                    }
                })
        })
        // .catch((err) => {
            // console.error(err)
            // return null
        // })
}

export const url = window.location.protocol === 'https:' ? _xivapi.url : _xivapi.public

export async function get(type, id) {
    switch (type) {
        case 'action':
            return Promise
                .resolve(true)
                .then(() => _getAction(id))
        default: return null
    }
}