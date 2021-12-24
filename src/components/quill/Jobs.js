// Import core components
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Promise from 'bluebird'
import axios from 'axios'

// Import our components
import { selectJobs, updateJobs } from 'db/slices/quill'
import { get as getKey } from 'toolkits/keys'
import * as Utils from 'toolkits/utils'

// Import style
// ...
// 

function QuillJobs() {
    const
        // Redux
        dispatch = useDispatch(),
        cache = {
            jobs: useSelector(selectJobs),
        },
        // Page
        url = getKey('xivapi.url'),
        api_key = getKey('xivapi.key')

    function urll(str, query = '') {
        return [url, ...str].join('/') + `?api_key=${api_key}${query.length ? `&${query}` : ``}`
    }

    function getJob(job) {
        return axios
            .get(urll(['ClassJob', job.ID]))
            .then((response) => {
                return Promise
                    .resolve(true)
                    .delay(500)
                    .then(() => {
                        if (!Utils.getObjValue(response.data, 'Role')) return false

                        return dispatch(updateJobs(
                            {
                                id: response.data.ID,
                                icon: response.data.Icon,
                                display_name: Utils.capitalize(response.data.Name_en),
                                short_name: response.data.Abbreviation_en,
                                role: response.data.Role,
                            }
                        ))
                    })
            })
            .catch((err) => {
                console.log(err)
            })
    }

    useEffect(() => {
        axios
            .get(urll(['ClassJob']))
            .then((response) => {
                // Explore each job
                dispatch(updateJobs(
                    {
                        id: 0,
                        short_name: '_',
                    }
                ))

                return Promise
                    .resolve(response.data.Results)
                    .map((job) => getJob(job), { concurrency: 1 })
            })
            .catch((err) => {
                console.log(err)
            })
    }, [])

    return (
        <pre>
            {Object.keys(cache.jobs).length > 0
                ? JSON.stringify(cache.jobs, null, 2)
                : "No data present"
            }
        </pre>
    )
}

export default QuillJobs