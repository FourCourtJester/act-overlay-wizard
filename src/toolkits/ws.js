// Import our Components
import * as Utils from 'toolkits/utils'

/**
 * Creates a valid WebSocket route
 *
 * @param {string} route
 * @returns {string}
 */
function _url() {
  const url = /[?&]OVERLAY_WS=([^&]+)/.exec(window.location.href)
  return url ? url[1] : 'ws://127.0.0.1:10501/ws'
}

class WS {
  constructor() {
    this.ws = undefined
    this.events = {}

    this.settings = {
      route: _url(),
      first: {
        connect: true,
      },
      intentional: {
        disconnect: false,
      },
      reconnect: {
        interval: 2 * 1000, // 2 seconds
        delta: 5 * 1000, // 5 seconds
      },
    }
  }

  // -----------------
  // PRIVATE FUNCTIONS
  // -----------------

  /**
   * Parses incoming messages
   *
   * @param {object} packet
   * @returns {boolean}
   */
  _parse(packet) {
    try {
      const _packet = JSON.parse(packet?.data)

      // console.log(_packet)

      // All other events
      this._emit(_packet.type, _packet)
    } catch (err) {
      console.error(err)
    }

    return true
  }

  /**
   * Low level emit to the Client
   *
   * @param {string} evt
   * @param {string} [ptr=success]
   * @param {object} [message={}]
   */
  _emit(evt, message = {}) {
    Object.values(this.events?.[evt] || {}).forEach((f) => {
      f?.success(message)
      f?.finally?.()
    })
  }

  // ----------------
  // PUBLIC FUNCTIONS
  // ----------------

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

        // Emit Connect handlers
        this._emit('connect')

        // Emit Reconnect handlers
        if (!this.settings.first.connect) this._emit('reconnect')

        // Reset disconnect flag
        this.settings.intentional.disconnect = false

        // Assign listening to passed events
        this.ws.addEventListener('message', (msg) => this._parse(msg))
      })

      // Close event
      this.ws.addEventListener('close', async (ce) => {
        Utils.log(`WS: Closed -`, ce)

        if (this.ws.readyState !== this.ws.CLOSED) return false

        // Cleanly reset the socket
        this.ws.close()

        if (!this.settings.intentional.disconnect) {
          this.settings.first.connect = false

          // Emit Disconnect handlers
          this._emit('disconnect')

          // Reconnect on a random interval
          setTimeout(this.connect.bind(this), Math.floor(this.settings.reconnect.interval + Math.random() * this.settings.reconnect.delta))
        }
      })

      return true
    } catch (err) {
      console.error(err)
      return false
    }
  }

  /**
   * Disconnect the WebSocket from the server
   *
   * @param {boolean} intentional
   */
  disconnect(intentional = false) {
    this.settings.intentional.disconnect = intentional
    this.ws.close()
  }

  /**
   * Stores an event listener
   *
   * @param {string} evt
   * @param {Function} fs
   */
  on(evt, fs) {
    if (!this.events?.[evt]) this.events[evt] = {}

    Object.entries(fs).forEach(([key, f]) => {
      this.events[evt][key] = f
    })
  }

  /**
   * Removes an event listener
   *
   * @param {Array|string} evts
   * @param {Array} keys
   */
  off(evts, keys = []) {
    keys.forEach((key) => {
      const _evts = !Array.isArray(evts) ? [evts] : evts

      _evts.forEach((evt) => {
        if (this.events?.[evt]) delete this.events[evt][key]
      })
    })
  }

  /**
   * Send a message to the WebSocket Server
   *
   * @param {object} obj
   * @returns {boolean}
   */
  send(obj) {
    if (!this.isReady()) return true

    Utils.log('WS: Send -', obj)

    this.ws.send(JSON.stringify(obj))

    return true
  }

  /**
   * Determines if the socket is open and ready
   *
   * @returns {boolean}
   */
  isReady() {
    return this.ws && this.ws.readyState === this.ws.OPEN
  }
}

export default (route) => new WS(route)
