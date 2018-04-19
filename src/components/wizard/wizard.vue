<component class="component-wizard">
    <StepWelcome v-if="steps[step] === 'welcome'" class="step">
        <div class="progress" slot="progress">
            <div class="step-hl" :class="{active: _step === steps[step]}" v-for="_step in steps"/>
        </div>
    </StepWelcome>

    <StepTelemetry v-else-if="steps[step] === 'telemetry'" class="step">
        <div class="progress" slot="progress">
            <div class="step-hl" :class="{active: _step === steps[step]}" v-for="_step in steps"/>
        </div>
    </StepTelemetry>
    <StepVoipaccount v-else-if="steps[step] === 'voipaccount'" class="step">
        <div class="progress" slot="progress">
            <div class="step-hl" :class="{active: _step === steps[step]}" v-for="_step in steps"/>
        </div>
    </StepVoipaccount>
    <StepMicPermission v-else-if="steps[step] === 'microphone'" class="step">
        <div class="progress" slot="progress">
            <div class="step-hl" :class="{active: _step === steps[step]}" v-for="_step in steps"/>
        </div>
    </StepMicPermission>
</component>
