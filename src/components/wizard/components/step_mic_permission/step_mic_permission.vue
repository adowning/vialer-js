<component class="component-step-mic-permission">
    <header>
        {{$t('Microphone permission')}}
    </header>

    <div class="step-description">
        {{$t('In order to make calls, the plugin requires access to your microphone.')}}<br/>
    </div>
    <div class="step-container">
        <MicPermission :soundmeter="false"/>
    </div>

    <slot name="progress"></slot>
</component>
