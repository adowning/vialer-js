/**
* @module ModuleContacts
*/
const Presence = require('./index')
const SUBSCRIBE_DELAY = 50


/**
* Presence implementation for SIP.
*/
class PresenceSip extends Presence {

    constructor(endpoint) {
        super(endpoint)
        this.subscription = null
    }


    /**
    * Parse an incoming dialog XML request body and return
    * the account state from it.
    * @param {Request} notification - A SIP.js Request object.
    * @returns {String} - The state of the account.
    */
    _statusFromDialog(notification) {
        let parser = new DOMParser()
        let xmlDoc = parser ? parser.parseFromString(notification.request.body, 'text/xml') : null
        let dialogNode = xmlDoc ? xmlDoc.getElementsByTagName('dialog-info')[0] : null
        if (!dialogNode) throw Error('Notification message is missing a dialog node')

        let stateAttr = dialogNode.getAttribute('state')
        // let localNode = dialogNode.getElementsByTagName('local')[0]
        let stateNode = dialogNode.getElementsByTagName('state')[0]
        let state = 'unavailable'

        if (stateAttr === 'full') {
            state = 'available'
        }

        // State node has final say, regardless of stateAttr!
        if (stateNode) {
            switch (stateNode.textContent) {
                case 'trying':
                case 'proceeding':
                case 'early':
                    state = 'ringing'
                    break
                case 'confirmed':
                    state = 'busy'
                    break
                case 'terminated':
                    state = 'available'
                    break
            }
        }
        return state
    }


    /**
    * Subscribe to the SIP server. Use a subscription delay
    * to prevent the server from being hammered.
    * @returns {Promise} - Resolves when ready.
    */
    subscribe() {
        return new Promise((resolve, reject) => {
            this.subscription = this.app.modules.calls.ua.subscribe(`${this.endpoint.state.id}@voipgrid.nl`, 'dialog')
            this.subscription.on('notify', (notification) => {
                const status = this._statusFromDialog(notification)
                this.endpoint.setState({status})
                setTimeout(() => {
                    resolve(this.endpoint)
                }, SUBSCRIBE_DELAY)
            })
        })
    }


    /**
    * Stop listening for subscriber events from the SIP server and remove
    * the cached subscriber state.
    * @param {Number} accountId - The accountId to deregister.
    */
    unsubscribe() {
        if (this.subscription) {
            try {
                this.subscription.unsubscribe()
                this.endpoint.setState({status: 'unregistered'})
            } catch (err) {
                this.app.logger.debug(`${this}failed to unsubscribe properly`)
            }


        }
        this.subscription = null
    }
}

module.exports = PresenceSip
