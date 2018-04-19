<component class="component-step-welcome">
    <header>
        {{greeting}}
    </header>

    <div class="step-description">
        {{$t('Welcome to your')}} {{app.name}}.<br/>
        <span>
            {{$t('You can now receive, transfer and create calls straight from your browser.')}}<br/>
            {{$t('Let\'s get you set up.')}}
        </span>
    </div>

    <slot name="progress"></slot>

    <div class="buttons is-centered">
        <button type="button" class="button is-primary" @click="nextStep()">{{$t('Next')}}</button>
    </div>
</component>
