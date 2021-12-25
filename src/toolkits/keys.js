import { getObjValue } from "toolkits/utils"

const keys = {
    xivapi: {
        url: 'https://xivapi.com',
        public: 'http://xivapi.com',
        key: '3be1bf2c362b431a9a988372201d5c73271e2ee044a84611b2e3974f102dea7b'
    },
}

export function get(key) {
    return getObjValue(keys, key)
}