/**
 * This is the click-to-dial app that runs all scripts
 * combined, replacing all ipc messaging with local
 * event emitters. This version also runs in Electron as
 * a desktop app.
 */

const ClickToDialApp = require('./lib/app')

const resizeSensor = require('css-element-queries').ResizeSensor

let isElectron

try {
    // Skip electron from transpilation.
    let electronNamespace = 'electron'
    window.electron = require(electronNamespace)
    isElectron = true
} catch (e) {
    isElectron = false
}

const _modules = [
    {name: 'availability', Module: require('./modules/availability')},
    {name: 'contacts', Module: require('./modules/contacts')},
    {name: 'dialer', Module: require('./modules/dialer')},
    {name: 'ui', Module: require('./modules/ui')},
    {name: 'user', Module: require('./modules/user')},
    {name: 'queues', Module: require('./modules/queues')},
]

document.addEventListener('DOMContentLoaded', () => {
    // Set content height for electron.
    if (isElectron) {
        electron.ipcRenderer.send('resize-window', {
            height: document.body.clientHeight,
            width: document.body.clientWidth,
        })

        resizeSensor(document.body, (e) => {
            electron.ipcRenderer.send('resize-window', {
                height: document.body.clientHeight,
                width: document.body.clientWidth,
            })
        })
    }

    global.app = new ClickToDialApp({
        environment: {
            extension: false,
            electron: isElectron,
        },
        i18n: require('../_locales/en/messages.json'),
        modules: _modules,
        name: 'webview',
    })
})