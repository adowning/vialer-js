<component class="component-call-keypad" tabindex="-1" :class="{'call-ongoing': callOngoing}">
    <div class="disabled-placeholder" v-if="callingDisabled">
        <icon class="disabled-icon" name="dialpad-off"/>
        <div class="disabled-text">
            {{$t('You cannot call out at the moment.')}}
        </div>
        <div class="disabled-reason">
            <ul>
                <li v-for="reason in callingDisabled">
                    {{translations('callingDisabled', reason)}}
                </li>
            </ul>
        </div>
    </div>
    <template v-else>
        <div :class="classes('number-input')" v-if="display === 'dense'">
            <input type="text" ref="input" autofocus placeholder="..."
                @keyup="pressKey()" @keydown="pressKey($event.key)"

                v-bind:value="number" v-on:input="inputChange($event.target.value)"
                v-on:keyup.enter="createCall(number)"/>

            <i class="icon icon-small" v-if="mode === 'call'" :class="{'disabled': !number}"
                v-on:keyup.enter="keypadAction" @click="createCall(number)"><icon name="transfer"/></i>
        </div>
        <div :class="classes('number-input')" v-else-if="display === 'touch'">
            <input type="text" ref="input" autofocus placeholder="..."
                @keyup="pressKey()" @keydown="pressKey($event.key)"
                v-bind:value="number" v-on:input="inputChange($event.target.value)"
                v-on:keyup.enter="createCall(number)"/>

            <i class="correct" v-if="mode === 'call'" @click="removeLastNumber">
                <icon name="correct"/>
            </i>
        </div>

        <div class="contacts-match" v-if="mode === 'call'">
            <span v-if="matchedContact">{{matchedContact.endpoint.number}} - {{matchedContact.contact.name}}</span>
        </div>

        <div class="keys" v-if="display === 'touch'" v-on:keyup.enter="createCall(number)">
            <div class="key-row">
                <button class="rounded-button key" @mouseup="pressKey()" @mousedown="pressKey('1')">1</button>
                <button class="rounded-button key" @mouseup="pressKey()" @mousedown="pressKey('2')">2<div class="sub">ABC</div></button>
                <button class="rounded-button key" @mouseup="pressKey()" @mousedown="pressKey('3')">3<div class="sub">DEF</div></button>
            </div>
            <div class="key-row">
                <button class="rounded-button key" @mouseup="pressKey()" @mousedown="pressKey('4')">4<div class="sub">GHI</div></button>
                <button class="rounded-button key" @mouseup="pressKey()" @mousedown="pressKey('5')">5<div class="sub">JKL</div></button>
                <button class="rounded-button key" @mouseup="pressKey()" @mousedown="pressKey('6')">6<div class="sub">MNO</div></button>
            </div>
            <div class="key-row">
                <button class="rounded-button key" @mouseup="pressKey()" @mousedown="pressKey('7')">7<div class="sub">PQRS</div></button>
                <button class="rounded-button key" @mouseup="pressKey()" @mousedown="pressKey('8')">8<div class="sub">TUV</div></button>
                <button class="rounded-button key" @mouseup="pressKey()" @mousedown="pressKey('9')">9<div class="sub">WXYZ</div></button>
            </div>
            <div class="key-row">
                <button class="rounded-button key" @mouseup="pressKey()" @mousedown="pressKey('*')">*</button>
                <button class="rounded-button key" @mouseup="pressKey()" @mousedown="pressKey('0')">0<div class="sub">+</div></button>
                <button class="rounded-button key" @mouseup="pressKey()" @mousedown="pressKey('#')">#</button>
            </div>
        </div>
        <!-- Dial actions when not used in combination with a call. -->
        <div class="call-actions touch" v-if="mode === 'call' && display === 'touch'">
            <div class="rounded-button action dial" @click="createCall(number)" :class="{'disabled': !number}">
                <icon name="phone"/>
            </div>
        </div>
    </template>
</component>
