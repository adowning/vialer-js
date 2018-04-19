module.exports = (app) => {
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
        render: templates.wizard_step_welcome.r,
        staticRenderFns: templates.wizard_step_welcome.s,
        store: {
            app: 'app',
            step: 'settings.wizard.step',
        },
    }

    return WizardStepWelcome
}
