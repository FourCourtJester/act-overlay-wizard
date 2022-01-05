// Import core components
import { createContext, useEffect, useRef } from 'react'

// Import our components
import * as Utils from 'toolkits/utils'

const Context = createContext()

class WS {
    constructor() {
        this.ws = undefined

        this.events = new Set()
        this.callbacks = {}

        this.settings = {
            route: this._url(),
            first: {
                connect: true,
            },
            reconnect: {
                interval: 2 * 1000, // 2 seconds
                delta: 5000, // 5 seconds
            },
        }

        return this
    }

    // ----------------
    // PRIVATE FUNCTIONS
    // ----------------

    /**
     * Parses incoming messages
     * @param {Object} packet 
     * @return {Boolean}
     */
    _parse(packet) {
        // Pong Event
        // if (packet == '.') return this.ws.send('.')

        // console.log(packet)

        try {
            packet = JSON.parse(packet)

            // All other events
            this._emit(packet.type, packet)
        } catch (err) {
            console.error(err)
        }

        return true
    }

    /**
     * Low level emit to the Client
     * @param {String} evt
     * @param {Object} message 
     */
    _emit(evt, message) {
        const events = this.callbacks[evt] || {}
        
        Object.values(events).forEach((cbs) => {
            cbs.forEach((cb) => cb(message))
        })
    }

    _subscribe(evt) {
        if (this.events.has(evt)) return false

        this.send('subscribe', { message: evt })
        this.events.add(evt)

        return true
    }

    /**
     * Creates a valid WebSocket route
     * @return {String}
     */
    _url() {
        const url = /[?&]OVERLAY_WS=([^&]+)/.exec(window.location.href)
        return url ? url[1] : 'ws://127.0.0.1:10501/ws'
    }

    // ----------------
    // PUBLIC FUNCTIONS
    // ----------------

    /**
     * Connect the WebSocket to the server
     * @return {Boolean}
     */
    connect() {
        try {
            // Invalid Route
            if (!this.settings.route) throw new Error('No WS URL was entered')

            // Initiate a new WebSocket
            this.ws = new WebSocket(this.settings.route)

            // Error event
            this.ws.addEventListener('error', (err) => {
                console.error(err)
            })

            // Open event
            this.ws.addEventListener('open', async () => {
                Utils.log(`WS: Open - ${this.settings.route}`)

                // Assign listening to passed events
                this.ws.addEventListener('message', (me) => this._parse(me.data))

                this.ws.send(JSON.stringify({
                    call: 'subscribe',
                    events: [
                        // "onOverlayDataUpdate",
                        // "SendCharName",
                        // "CombatData",
                        // "EnmityAggroList",
                        // "EnmityTargetData",
                        "ChangePrimaryPlayer",
                        "PartyChanged",
                        "LogLine",
                        // "GetCombatants",
                        "ChangeZone",
                    ]
                }))

                // Subscribe to all external events
                // Object.keys(this.events).forEach((e) => this._subscribe(e))
            })

            // Close event
            this.ws.addEventListener('close', async (ce) => {
                Utils.log(`WS: Closed -`, ce)

                // Cleanly reset the socket
                this.ws.close()
                this.ws = undefined

                // Remove all external event listeners
                this.events.clear()
                this.settings.first.connect = false

                // Reconnect on a random interval
                setTimeout(this.connect.bind(this), Math.floor(this.settings.reconnect.interval + (Math.random() * this.settings.reconnect.delta)))
            })

            return true
        } catch (err) {
            console.error(err)
            return false
        }
    }

    /**
     * Disconnect the WebSocket from the server
     */
    disconnect() {
        if (this.ws) this.ws.close()
    }

    /**
     * Adds the callback to the listeners of the event
     * @param {String} evt 
     * @param {String} component 
     * @param {Function} cb 
     */
    on(evt, component, cb) {
        if (!Array.isArray(evt)) evt = [evt]

        evt.forEach((e) => {
            // Create the events object, if necessary
            if (!this.callbacks?.[e]) this.callbacks[e] = {}

            // Prevent overwriting and duplication of events
            if (Object.prototype.hasOwnProperty.call(this.callbacks[e], component)) return true

            // Create the callback array, if necessary
            if (!this.callbacks[e]?.[component]) this.callbacks[e][component] = []

            // Add the listener
            this.callbacks[e][component].push(cb ? cb : () => { })

            if (this.ws && this.ws.readyState === this.ws.OPEN) this._subscribe(e)
        })
    }

    /**
     * Send a message to the WebSocket Server
     * @param {String} evt 
     * @param {Object} [opts]
     * @param {Object} [opts.message]
     * @return {Boolean}
     */
    send(evt, opts) {
        Utils.log('WS: Send -', evt, opts?.message)

        this.ws.send(JSON.stringify({
            event: evt,
            message: opts?.message,
        }))

        return true
    }
}

/**
 * Websocket Provider Component
 */
function Provider(params) {
    const
        { ...props } = params,
        __ws = new WS(),
        _ws = useRef(__ws)

    // ComponentDidMount equivalent
    useEffect(() => {
        const ws = _ws.current

        // Open the connection
        ws.connect()

        // ComponentWillUnmount equivalent
        return () => {
            // Close the connection
            ws.disconnect(true)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Context.Provider value={_ws.current} {...props} />
    )
}

export { Context as WebSocketContext, Provider as WebSocketProvider }