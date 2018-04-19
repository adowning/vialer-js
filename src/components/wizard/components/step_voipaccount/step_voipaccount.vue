<component class="component-step-voipaccount">
    <header>
        {{$t('VoIP accounts')}}
    </header>

    <div class="step-description">
        <span>
            {{$t('The following VoIP accounts are linked to your account.')}}
            {{$t('You can manage your users and VoIP accounts from ')}}

            <br/><br/>
            {{`${$t('Select the one you want to use in')} ${app.name}`}}.
        </span>
        <VoipaccountPicker/>
    </div>

    <slot name="progress"></slot>

    <div class="buttons is-centered">
        <button type="button" class="button is-primary" @click="nextStep()">{{$t('Next')}}</button>
    </div>
</component>
