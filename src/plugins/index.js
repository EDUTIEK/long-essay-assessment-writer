/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import vuetify from './vuetify'
import pinia from '../store'
import { createI18n } from 'petite-vue-i18n'
/*
 * All i18n resources specified in the plugin `include` option can be loaded
 * at once using the import syntax
 */
import messages from '@intlify/unplugin-vue-i18n/messages'

const i18n = createI18n({
  locale: 'de',
  messages
})

// this way you can switch the language programmatically in a function
// import i18n from "@/i18n"
// i18n.global.locale.value = 'en';
// document.querySelector("html").setAttribute('lang', 'en')

export function registerPlugins(app) {
  app
    .use(vuetify)
    .use(pinia)
    .use(i18n)
}
