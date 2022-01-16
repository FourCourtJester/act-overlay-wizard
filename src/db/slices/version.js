// Import core components
import { createSlice } from '@reduxjs/toolkit'

// Import our components
import * as Storage from 'toolkits/storage'
import * as Utils from 'toolkits/utils'

const
    name = 'version',
    initial_state = {
        id: '6.05.b',
        component: {
            bestiary: {
                x: 11,
                y: 885,
                width: 434,
                height: 156,
            },
            spellbook: {
                x: 916,
                y: 310,
            }
        },
    }

function getState() {
    try {
        const persistent_state = Utils.getObjValue(Storage.get(`redux`), name) || {}

        return Object
            .entries(Utils.getObjPaths(persistent_state))
            .reduce((obj, [key, val]) => {
                Utils.setObjValue(obj, key, val)
                return obj
            }, initial_state)
    } catch (err) {
        console.error(err)
        return initial_state
    }
}

// Jobs Slice
export const version = createSlice({
    name: name,
    initialState: getState(),
    reducers: {
        updateDraggable: (state, { payload: { component, x, y } }) => {
            state.component[component] = {
                ...state.component[component],
                x,
                y,
            }
        },
        updateResizable: (state, { payload: { component, width, height } }) => {
            state.component[component] = {
                ...state.component[component],
                width,
                height,
            }
        },
    },
})

// Reducer functions
export const {
    updateDraggable,
    updateResizable,
} = version.actions

// Selector functions
export const selectVersion = (state) => state[name].id
export const selectComponent = (state, component) => state[name].component?.[component]

export default version.reducer