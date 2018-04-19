module.exports = (app) => {
    // Initialize sub-components of the wizard.
    Vue.component('StepMicPermission', require('./components/step_mic_permission')(app))
    Vue.component('StepTelemetry', require('./components/step_telemetry')(app))
    Vue.component('StepVoipaccount', require('./components/step_voipaccount')(app))
    Vue.component('StepWelcome', require('./components/step_welcome')(app))
    /**
    * @memberof fg.components
    */
    const Wizard = {
        beforeMount: function() {
            if (this.settings.telemetry.enabled === null) this.steps.push('telemetry')
            this.steps.push('voipaccount')
            if (!this.settings.webrtc.media.permission) this.steps.push('microphone')
            console.log(this.steps, this.step)
        },
        computed: app.helpers.sharedComputed(),
        data: function() {
            return {
                steps: ['welcome'],
            }
        },
        methods: Object.assign({
            nextStep: function() {
                this.step += 1
            },
        }, app.helpers.sharedMethods()),

        render: templates.wizard.r,
        staticRenderFns: templates.wizard.s,
        store: {
            app: 'app',
            settings: 'settings',
            step: 'settings.wizard.step',
        },
    }

    return Wizard
}
