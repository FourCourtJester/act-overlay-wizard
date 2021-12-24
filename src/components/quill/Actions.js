// Import core components
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Promise from 'bluebird'
import axios from 'axios'

// Import our components
import { selectActions, updateActions } from 'db/slices/quill'
import { get as getKey } from 'toolkits/keys'
import * as Utils from 'toolkits/utils'

// Import style
// ...
// 

function QuillActions() {
    const
        // Redux
        dispatch = useDispatch(),
        cache = {
            actions: useSelector(selectActions),
        },
        // Page
        url = getKey('xivapi.url'),
        api_key = getKey('xivapi.key')

    function urll(str, query = '') {
        return [url, ...str].join('/') + `?api_key=${api_key}${query.length ? `&${query}` : ``}`
    }

    function getActions(page = 1) {
        return axios
            .get(urll(['search'], `indexes=Action&filters=ClassJobCategory!&page=${page}`))
            .then((response) => {
                // Explore each action
                dispatch(updateActions(
                    {
                        id: 0,
                        short_name: '_',
                    }
                ))

                return Promise
                    .resolve(response.data.Results)
                    .map((action) => getAction(action), { concurrency: 1 })
                    .then(() => Utils.getObjValue(response.data.Pagination, 'PageNext'))
            })
            .then((resume) => {
                if (resume) return getActions(page + 1)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    function getAction(action) {
        return axios
            .get(urll(['Action', action.ID]))
            .then((response) => {
                return Promise
                    .resolve(true)
                    .delay(250)
                    .then(() => {
                        // if (!Utils.getObjValue(response.data, 'IsPlayerAction') && !Utils.getObjValue(response.data, 'IsRoleAction')) return false
                        if (+Utils.getObjValue(response.data, 'ClassJob.DohDolJobIndex') > -1) return false
                        if (Utils.getObjValue(response.data, 'IsPvP')) return false
                        if (!isUsefulGlobalAction(response.data)) return false

                        return dispatch(updateActions(
                            {
                                id: response.data.ID,
                                icon: response.data.IconHD,
                                display_name: response.data.Name_en,
                                jobs: jobAssignment(response.data.ClassJobCategory.Name_en),
                                cooldown: response.data.Recast100ms / 10,
                                duration: +getDuration(response.data.Description_en) || 0
                            }
                        ))
                    })
            })
            .catch((err) => {
                console.log(err)
            })
    }

    function isUsefulGlobalAction(action) {
        const exempt = ['Sprint']

        switch (Utils.getObjValue(action, 'ClassJobCategory.Name_en')) {
            case 'All Classes': return exempt.includes(action.Name_en) ? true : false
            default: return true
        }
    }

    function jobAssignment(jobs) {
        switch (jobs) {
            case 'All Classes': return ['*']
            default: return jobs.split(' ')
        }
    }

    function getDuration(str) {
        if (!str.length) return 0

        return str.match(/Duration:<\/span>\s(\d+)s/)?.[1]
    }

    useEffect(() => {
        getActions()
    }, [])

    return (
        <pre>
            {Object.keys(cache.actions).length > 0
                ? JSON.stringify(cache.actions, null, 2)
                : "No data present"
            }
        </pre>
    )
}

export default QuillActions