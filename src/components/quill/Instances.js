// Import core components
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Promise from 'bluebird'
import axios from 'axios'

// Import our components
import { selectInstances, updateInstances } from 'db/slices/quill'
import { get as getKey } from 'toolkits/keys'
import * as Utils from 'toolkits/utils'

// Import style
// ...
// 

function QuillInstances() {
    const
        // Redux
        dispatch = useDispatch(),
        cache = {
            instances: useSelector(selectInstances),
        },
        // Page
        url = getKey('xivapi.url'),
        api_key = getKey('xivapi.key')

    function urll(str, query = '') {
        return [url, ...str].join('/') + `?api_key=${api_key}${query.length ? `&${query}` : ``}`
    }

    function getInstances(page = 1) {
        return axios
            .get(urll(['InstanceContent'], `&page=${page}`))
            .then((response) => {
                // Explore each instance
                dispatch(updateInstances(
                    {
                        id: 0,
                        display_name: '_',
                        zone: 0,
                    }
                ))

                return Promise
                    .resolve(response.data.Results)
                    .map((instance) => getInstance(instance), { concurrency: 1 })
                    .then(() => Utils.getObjValue(response.data.Pagination, 'PageNext'))
            })
            .then((resume) => {
                if (resume) return getInstances(page + 1)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    function getInstance(instance) {
        return axios
            .get(urll(['InstanceContent', instance.ID]))
            .then((response) => {
                return Promise
                    .resolve(true)
                    .delay(250)
                    .then(() => {
                        if (!Utils.getObjValue(response.data, 'ContentFinderCondition')) return false
                        if (!Utils.getObjValue(response.data, 'Banner')) return false

                        return dispatch(updateInstances(
                            {
                                id: response.data.ContentFinderCondition.TerritoryType.ID,
                                banner: response.data.Banner,
                                display_name: Utils.capitalize(response.data.Name_en),
                                xivapi_id: response.data.ID,
                            }
                        ))
                    })
            })
            .catch((err) => {
                console.log(err)
            })
    }

    useEffect(() => {
        getInstances()
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <pre>
            {Object.keys(cache.instances).length > 0
                ? JSON.stringify(cache.instances, null, 2)
                : "No data present"
            }
        </pre>
    )
}

export default QuillInstances