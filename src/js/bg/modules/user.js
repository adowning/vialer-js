/**
* The User module deals with everything that requires some
* form of authentication. It is currently very tighly coupled
* with the VoIPGRID vendor, but in theory should be able to deal
* with other authentication backends.
* @module ModuleUser
*/
const Module = require('../lib/module')


/**
* Main entrypoint for User.
* @memberof AppBackground.modules
*/
class ModuleUser extends Module {
    /**
    * Setup events that can be called upon from `AppForeground`.
    * The update-token event is called each time when a user
    * opens a vendor platform url through `openPlatformUrl`.
    * @param {AppBackground} app - The background application.
    */
    constructor(app) {
        super(app)
        // Other implementation may use other user identifiers than email,
        // that's why the main event uses `username` instead of `email`.
        this.app.on('bg:user:login', ({username, password}) => this.login({email: username, password}))
        this.app.on('bg:user:logout', this.logout.bind(this))
        this.app.on('bg:user:unlock', async({username, password}) => {
            this.app.setSession(username)
            try {
                await this.app.__unlockSession({password, username})
                this.app.api.setupClient(username, this.app.state.user.token)
                this.app.__initServices()
                this.app.setState({ui: {layer: 'calls'}}, {encrypt: false, persist: true})
            } catch (err) {
                this.app.setState({
                    ui: {layer: 'login'},
                    user: {authenticated: false},
                }, {encrypt: false, persist: true})
                const message = this.app.$t('Failed to unlock session. Check your password.')
                this.app.emit('fg:notify', {icon: 'warning', message, type: 'danger'})
            }
        })

        this.app.on('bg:user:set_session', ({session}) => {
            app.setSession(session)
        })

        this.app.on('bg:user:remove_session', ({session}) => {
            app.removeSession(session)
        })

        this.app.on('bg:user:update-token', async({callback}) => {
            await this._platformData()
            callback({token: this.app.state.user.platform.tokens.portal})
        })
    }


    /**
    * Initializes the module's store.
    * @returns {Object} The module's store properties.
    */
    _initialState() {
        return {
            authenticated: false,
            developer: false, // Unlocks experimental developer-only features.
            platform: {
                tokens: {
                    portal: null,
                    sip: null,
                },
            },
            token: null,
            username: null,
        }
    }


    /**
    * Retrieve the autologin token for the user. This token is
    * used to login automatically when the user opens a link
    * to the vendor portal.
    */
    async _platformData() {
        const res = await this.app.api.client.get('api/autologin/token/')
        this.app.setState({user: {platform: {tokens: {portal: res.data.token}}}})
    }


    /**
    * Make an api call with the current basic authentication to retrieve
    * profile information with. Save the credentials in storage when the call
    * is succesful, otherwise remove the credentials from the store.
    * @param {object} options - Options to pass.
    * @param {String} options.email - Email address to login with.
    * @param {String} options.password - Password to login with.
    */
    async login({email, password}) {
        this.app.setSession(email)
        let res = await this.app.api.client.post('api/permission/apitoken/', {email, password})
        // A login failure. Give the user feedback about what went wrong.
        if (this.app.api.NOTOK_STATUS.includes(res.status)) {
            let message
            const icon = 'warning', type = 'warning'
            if (!res.data.error) {
                message = this.app.$t('Failed to login. Please check your credentials.')
            } else {
                let failMessage = res.data.error.message
                // Notify the user about being blocked out of the platform due to
                // too many login attempts.
                if (failMessage.includes('Too many failed login attempts')) {
                    const date = failMessage.substring(failMessage.length - 9, failMessage.length - 1)
                    window.failMessage = failMessage
                    message = this.app.$t('Too many failed login attempts; try again at {date}', {date})
                }
            }

            this.app.emit('fg:notify', {icon, message, type})
            return
        }

        const token = res.data.api_token
        this.app.api.setupClient(email, token)
        await this.app.__unlockSession({password, username: email})
        res = await this.app.api.client.get('api/permission/systemuser/profile/')

        let user = res.data
        if (!user.client) {
            // Only platform client users are able to use vendor platform
            // telephony features. Logout partner users.
            this.logout()
            this.app.emit('fg:notify', {icon: 'settings', message: this.app.$t('The plugin can only be used by partner users.'), type: 'warning'})
            return
        }

        user.realName = [user.first_name, user.preposition, user.last_name].filter((i) => i !== '').join(' ')

        let startLayer
        if (!this.app.state.settings.wizard.completed) {
            // On install, go to the settings page.
            startLayer = 'settings'
        } else {
            startLayer = 'calls'
            this.app.emit('fg:notify', {icon: 'user', message: this.app.$t('Welcome back, {user}', {user: user.realName}), type: 'success'})
        }

        this.app.setState({
            // The `installed` and `updated` flag are toggled off after login.
            app: {installed: false, updated: false},
            ui: {layer: startLayer, menubar: {default: 'active'}},
            user: {username: email},
        }, {encrypt: false, persist: true})

        this.app.setState({
            user: {
                client_id: user.client.replace(/[^\d.]/g, ''),
                id: user.id,
                platform: {tokens: {sip: user.token}},
                realName: user.realName,
                token,
            },
        }, {persist: true})

        this.app.__initServices()
    }


    /**
    * Remove any stored session key, but don't delete the salt.
    * This will render the cached and stored state useless.
    */
    logout() {
        this.app.logger.info(`${this}logging out and cleaning up state`)
        this.app.emit('fg:notify', {icon: 'user', message: this.app.$t('Goodbye!'), type: 'success'})
        this.app.setState({
            app: {vault: {key: null, store: false, unlocked: false}},
            user: {authenticated: false},
        }, {encrypt: false, persist: true})
        // Remove credentials from basic auth.
        this.app.api.setupClient()
        // Disconnect without reconnect attempt.
        this.app.modules.calls.disconnect(false)
        this.app.emit('bg:user:logged_out', {}, true)
        this.app.setSession('new')
    }


    /**
    * Generate a representational name for this module. Used for logging.
    * @returns {String} - An identifier for this module.
    */
    toString() {
        return `${this.app}[user] `
    }
}

module.exports = ModuleUser
