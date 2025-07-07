/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import vuetify from './vuetify'
import pinia from '../store'
import i18n from './i18n'

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
