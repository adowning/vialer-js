module.exports = (app) => {
    const v = Vuelidate.validators

    /**
    * @memberof fg.components
    */
    const WizardStepWelcome = {
        computed: app.helpers.sharedComputed(),
        methods: Object.assign({
            nextStep: function() {
                this.step += 1
            },
        }, app.helpers.sharedMethods()),
        render: templates.voipaccount_picker.r,
        staticRenderFns: templates.voipaccount_picker.s,
        store: {
            app: 'app',
            settings: 'settings',
        },
        validations: function() {
            let validations = {
                settings: {
                    webrtc: {
                        account: {
                            selected: {
                                id: {
                                    requiredIf: v.requiredIf(() => {
                                        return this.settings.webrtc.enabled
                                    }),
                                },
                            },
                        },
                    },
                },
            }

            return validations
        },
    }

    return WizardStepWelcome
}
