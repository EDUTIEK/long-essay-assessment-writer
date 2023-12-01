import { defineStore } from 'pinia';
import axios from 'axios'
import Cookies from 'js-cookie';
import {useSettingsStore} from "@/store/settings";
import {useTaskStore} from "@/store/task";
import {useLayoutStore} from "@/store/layout";
import {useResourcesStore} from "@/store/resources";
import {useEssayStore} from "@/store/essay";
import {useNotesStore} from "@/store/notes";
import {useAlertStore} from "@/store/alerts";
import {useChangesStore} from "@/store/changes";

import md5 from 'md5';
import Note from "@/data/Note";
import Change from "@/data/Change";

const syncInterval = 5000;      // time (ms) to wait for syncing with the backend


/**
 * API Store
 * Handles the communication with the backend
 */
export const useApiStore = defineStore('api', {

    state: () => {
        return {
            // saved in storage
            backendUrl: '',                     // url to be used for REST calls
            returnUrl: '',                      // url to be called when the wsriter is closed
            userKey: '',                        // identifying key of the writing user
            environmentKey: '',                 // identifying key of the writing envirnonment (defining the task)
            dataToken: '',                      // authentication token for transmission if data
            fileToken: '',                      // authentication token for loading files
            timeOffset: 0,                      // differnce between server time and client time (ms)

            // not saved
            initialized: false,                 // used to switch from startup screen to the editing view
            review: false,                      // used to switch to the review and confirmation for a final submission
            showInitFailure: false,             // show a message that the initialisation failed
            showReplaceConfirmation: false,     // show a confirmation that the stored data should be replaced by another task or user
            showReloadConfirmation: false,      // show a confirmation that all data for the same task and user shod be reloaded from the server
            showFinalizeFailure: false,         // show a failure message for the final saving
            showAuthorizeFailure: false,        // show a failure message for the final authorization

            // should be unified in the next version
            lastStepsTry: 0,                    // timestamp of the last try to send writing steps
            lastSendingTry: 0                   // timestamp of the last try to send changes
        }
    },

  /**
   * Getter functions (with params) start with 'get', simple state queries not
   */
  getters: {

        isAllSent: state => {
          const essayStore = useEssayStore();
          const changesStore = useChangesStore();
          return !state.isSending && essayStore.openSendings + changesStore.countChanges == 0;
        },

        isSending: state => {
          state.lastSendingTry > 0 || state.lastStepsTry > 0;
        },

        getRequestConfig: state => {

          /**
           * Get the config object for REST requests
           * @param {string}  token
           * @return {object}
           */
          const fn = function(token) {
                let baseURL = state.backendUrl;
                let params = new URLSearchParams();

                // cut query string and set it as params
                // a REST path is added as url to the baseURL by axias calls
                let position = baseURL.search(/\?+/);
                if (position != -1) {
                    params = new URLSearchParams(baseURL.substr(position))
                    baseURL = baseURL.substr(0, position);
                }

                // add authentication info as url parameters
                // use signature instead of token because it is visible
                params.append('LongEssayUser', state.userKey);
                params.append('LongEssayEnvironment', state.environmentKey);
                params.append('LongEssaySignature', md5( state.userKey + state.environmentKey + token));

                return {
                    baseURL: baseURL,
                    params: params,
                    timeout: 30000,             // milliseconds
                    responseType: 'json',       // default
                    responseEncoding: 'utf8',   // default
                }
            }
            return fn;
        },

        getResourceUrl: state => {

          /**
           * Get the Url for loading a file ressource
           * @param {string}  resourceKey
           */
          const fn = function (resourceKey) {
                const config = this.getRequestConfig(this.fileToken);
                return config.baseURL + '/file/' + resourceKey + '?' + config.params.toString();
            }
            return fn;
        },

        getServerTime: state => {

          /**
           * Get the server unix timestamp (s) corresponding to a client timestamp (ms)
           * @param {number} clientTime
           * @return {number}
           */
          const fn = function (clientTime) {
            return clientTime == 0 ? 0 : Math.floor((clientTime - state.timeOffset) / 1000);
          }
          return fn;
        },


      getChangeDataToSend: state => {

        /**
         * Get the data of a change to be sent to the backend
         * @param {Change} change
         * @param {object|null} payload
         */
        const fn = function(change, payload = null) {
          const data = change.getData();
          if (payload) {
            data.payload = payload;
          }
          data.server_time = state.getServerTime(change.last_change);
          return data;
        }
        return fn;
      }


    },


    actions: {

        /**
         * Init the state
         * Take the state from the cookies or local store
         * Trigger a reload of all data if cookie values differ from local store
         */
        async init () {

            let newContext = false;
            let lastHash = Cookies.get('LongEssayHash');

            // take values formerly stored
            this.backendUrl = localStorage.getItem('writerBackendUrl');
            this.returnUrl = localStorage.getItem('writerReturnUrl');
            this.userKey = localStorage.getItem('writerUserKey');
            this.environmentKey = localStorage.getItem('writerEnvironmentKey');
            this.dataToken = localStorage.getItem('writerDataToken');
            this.fileToken = localStorage.getItem('writerFileToken');
            this.timeOffset = Math.floor(localStorage.getItem('writerTimeOffset') ?? 0);

            // check if context given by cookies differs and force a reload if neccessary
            if (!!Cookies.get('LongEssayUser') && Cookies.get('LongEssayUser') !== this.userKey) {
                this.userKey = Cookies.get('LongEssayUser');
                newContext = true;
            }
            if (!!Cookies.get('LongEssayEnvironment') && Cookies.get('LongEssayEnvironment') !== this.environmentKey) {
                this.environmentKey = Cookies.get('LongEssayEnvironment');
                newContext = true;
            }

            // these values can be changed without forcing a reload
            if (!!Cookies.get('LongEssayBackend') && Cookies.get('LongEssayBackend') !== this.backendUrl) {
                this.backendUrl = Cookies.get('LongEssayBackend');
            }
            if (!!Cookies.get('LongEssayReturn') && Cookies.get('LongEssayReturn') !== this.returnUrl) {
                this.returnUrl = Cookies.get('LongEssayReturn');
            }
            if (!!Cookies.get('LongEssayToken') && Cookies.get('LongEssayToken') !== this.dataToken) {
                this.dataToken = Cookies.get('LongEssayToken');
            }

            if (!this.backendUrl || !this.returnUrl || !this.userKey || !this.environmentKey || !this.dataToken)
            {
                this.showInitFailure = true;
                return;
            }

            const essayStore = useEssayStore();
            const changesStore = useChangesStore();

            if (newContext) {
                // switching to a new task or user always requires a load from the backend
                // be shure that existing data is not unintentionally replaced

                if (await essayStore.hasUnsentSavingsInStorage()
                  || changesStore.countChanges > 0) {
                    console.log('init: new context, open savings');
                    this.showReplaceConfirmation = true;
                }
                else {
                    console.log('init: new context, no open savings');
                    await this.loadDataFromBackend();
                }
            }
            else if (lastHash) {
                // savings already exists on the server
                // check that it matches with the data in the app

                if (await essayStore.hasHashInStorage(lastHash)) {
                    console.log('init: same context, same hash');
                    await this.loadDataFromStorage();
                }
                else if (await essayStore.hasUnsentSavingsInStorage()
                  || changesStore.countChanges > 0) {
                    console.log('init: same context, hashes differ, open savings');
                    this.showReloadConfirmation = true;
                }
                else {
                    console.log('init: same context, hashes differ, no open savings');
                    await this.loadDataFromBackend();
                }
            }
            else {
                // no savings exist on the server
                // check if data is already entered but not sent

                if (await essayStore.hasUnsentSavingsInStorage()
                  || changesStore.countChanges > 0) {
                    console.log('init: same context, no server hash, open savings');
                    await this.loadDataFromStorage();
                }
                else {
                    console.log('init: same context, no server hash, no open savings');
                    await this.loadDataFromBackend();
                }
            }

            setInterval(this.timedSync, syncInterval);
        },

      /**
       * Do the regular synchronisation (called from timer)
       */
        async timedSync() {
            await this.saveChangesToBackend();
            await this.loadUpdateFromBackend();
        },


        /**
         * Load all data from the storage
         */
        async loadDataFromStorage() {

            console.log("loadDataFromStorage...");
            this.updateConfig();

            const settingsStore = useSettingsStore();
            const taskStore = useTaskStore();
            const resourcesStore = useResourcesStore();
            const essayStore = useEssayStore();
            const notesStore = useNotesStore();
            const layoutStore = useLayoutStore();
            const changesStore = useChangesStore();

            await settingsStore.loadFromStorage();
            await taskStore.loadFromStorage();
            await resourcesStore.loadFromStorage();
            await essayStore.loadFromStorage();
            await notesStore.loadFromStorage();
            await layoutStore.loadFromStorage();
            await changesStore.loadFromStorage();


            // directy check for updates of task settings to avoid delay
            await this.loadUpdateFromBackend();
            this.initialized = true;
        },


        /**
         * Load all data from the backend
         */
        async loadDataFromBackend() {

            console.log("loadDataFromBackend...");
            this.updateConfig();

            let response = {};
            try {
                response = await axios.get( '/data', this.getRequestConfig(this.dataToken));
                this.setTimeOffset(response);
                this.refreshToken(response);
            }
            catch (error) {
                console.error(error);
                this.showInitFailure = true;
                return;
            }

            const settingsStore = useSettingsStore();
            const taskStore = useTaskStore();
            const resourcesStore = useResourcesStore();
            const essayStore = useEssayStore();
            const notesStore = useNotesStore();
            const changesStore = useChangesStore();
            const layoutStore = useLayoutStore();

            await settingsStore.loadFromData(response.data.settings);
            await taskStore.loadFromData(response.data.task);
            await resourcesStore.loadFromData(response.data.resources);
            await essayStore.loadFromData(response.data.essay);
            await notesStore.loadFromData(response.data.notes);
            await notesStore.prepareNotes(settingsStore.notice_boards);

            await changesStore.clearStorage();
            await layoutStore.clearStorage();

            // send the time when the working on the task is started
            if (!response.data.essay.started) {
                await this.sendStart();
            }
            this.initialized = true;
        },

        /**
         * Check for updates from the backend
         * - new writing end
         * - messages
         */
        async loadUpdateFromBackend() {

            // don't interfer with a running request
            if (this.lastSendingTry > 0) {
              return false;
            }
            this.lastSendingTry = Date.now();

            try {
                const response = await axios.get( '/update', this.getRequestConfig(this.dataToken));
                this.setTimeOffset(response);
                this.refreshToken(response);

                const taskStore = useTaskStore();
                const alertStore = useAlertStore();
                await taskStore.loadFromData(response.data.task);
                await alertStore.loadFromData(response.data.alerts);

                this.lastSendingTry = 0;
                return true;
            }
            catch (error) {
                console.error(error);
                this.lastSendingTry = 0;
                return false;
            }
        },

        /**
         * Send the time when the editing has started
         */
        async sendStart() {

            let response = {};
            let data = {
                started: this.getServerTime(Date.now())
            }
            try {
                response = await axios.put( '/start', data, this.getRequestConfig(this.dataToken));
                this.setTimeOffset(response);
                this.refreshToken(response);
                return true;
            }
            catch (error) {
                console.error(error);
                this.showInitFailure = true;
                return false;
            }
        },


        /**
         * Save the writing steps to the backend
         */
        async saveWritingStepsToBackend(steps) {
            let response = {};
            let data = {
                steps: steps
            }

            this.lastStepsTry = Date.now();
            try {
                response = await axios.put( '/steps', data, this.getRequestConfig(this.dataToken));
                this.setTimeOffset(response);
                this.refreshToken(response);
                this.lastStepsTry = 0;
                return true;
            }
            catch (error) {
                console.error(error);
                this.lastStepsTry = 0;
                return false;
            }
        },

      /**
       * Periodically send changes to the backend
       * Timer is set in initialisation
       *
       * @param bool wait    wait some seconds for a running sending to finish (if not called by timer)
       * @return bool
       */
      async saveChangesToBackend(wait = false) {
        const changesStore = useChangesStore();
        const notesStore = useNotesStore();

        // wait up to seconds for a running request to finish before giving up
        if (wait) {
          let tries = 0;
          while (tries < 5 && this.lastSendingTry > 0) {
            tries++;
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }

        // don't interfer with a running request
        if (this.lastSendingTry > 0) {
          return false;
        }

        if (changesStore.countChanges > 0) {
          this.lastSendingTry = Date.now();

          try {
            const data = {
              notes: await notesStore.getChangedData(this.lastSendingTry),
              preferences: [],
            };

            const response = await axios.put( '/changes', data, this.getRequestConfig(this.dataToken));
            this.setTimeOffset(response);
            this.refreshToken(response);

            await changesStore.setChangesSent(Change.TYPE_NOTES, response.data.notes, this.lastSendingTry);
            await changesStore.setChangesSent(Change.TYPE_PREFERENCES, response.data.preferences, this.lastSendingTry);
          }
          catch (error) {
            console.error(error);
            this.lastSendingTry = 0;
            return false;
          }
          this.lastSendingTry = 0;
        }

        return true;
      },


      /**
         * Save the final authorization to the backend
         */
        async saveFinalContentToBackend(steps, content, hash, authorized) {
            let response = {};
            let data = {
                steps: steps,
                content: content,
                hash: hash,
                authorized: authorized
            }
            try {
                response = await axios.put( '/final', data, this.getRequestConfig(this.dataToken));
                this.refreshToken(response);
                return true;
            }
            catch (error) {
                console.error(error);
                return false;
            }
        },


        /**
         * Update the app configuration
         * This is called when the initialisation can be done silently
         * Or when a confirmation dialog is confirmed
         */
        updateConfig() {

            // remove the cookies
            // needed to distinct the call from the backend from a later reload
            Cookies.remove('LongEssayBackend');
            Cookies.remove('LongEssayReturn');
            Cookies.remove('LongEssayUser');
            Cookies.remove('LongEssayEnvironment');
            Cookies.remove('LongEssayToken');
            Cookies.remove('LongEssayHash');

            localStorage.setItem('writerBackendUrl', this.backendUrl);
            localStorage.setItem('writerReturnUrl', this.returnUrl);
            localStorage.setItem('writerUserKey', this.userKey);
            localStorage.setItem('writerEnvironmentKey', this.environmentKey);
            localStorage.setItem('writerDataToken', this.dataToken);
            localStorage.setItem('writerFileToken', this.fileToken);
        },


        /**
         * Set the offset between server time and client time
         * The offset is used to calculate the correct remaining time of the task
         * The offset should be set from the response of a REST call
         * when the response data transfer is short (no files)
         */
        setTimeOffset(response) {
            if (response.headers['longessaytime']) {
                const serverTimeMs = response.headers['longessaytime'] * 1000;
                const clientTimeMs = Date.now();

                this.timeOffset = clientTimeMs - serverTimeMs;
                localStorage.setItem('writerTimeOffset', this.timeOffset);
            }
        },

        /**
         * Refresh the auth token with the value from the REST response
         * Each REST call will generate a new auth token
         * A token has only a certain valid time (e.g. one our)
         * Within this time a new REST call must be made to get a new valid token
         */
        refreshToken(response) {
            if (response.headers['longessaydatatoken']) {
                this.dataToken = response.headers['longessaydatatoken'];
                localStorage.setItem('writerDataToken', this.dataToken);
            }

            if (response.headers['longessayfiletoken']) {
                this.fileToken = response.headers['longessayfiletoken'];
                localStorage.setItem('writerFileToken', this.fileToken);
            }
        },

        /**
         * Finalize the writing
         * This is called for any regular leaving of the writer (interruption or submission)
         * The written content is sent to the server and the local storage is cleared
         */
        async finalize(authorize) {

            const settingsStore = useSettingsStore();
            const taskStore = useTaskStore();
            const resourcesStore = useResourcesStore();
            const essayStore = useEssayStore();
            const layoutStore = useLayoutStore();
            const alertStore = useAlertStore();

            if (authorize || essayStore.openSendings > 0) {
                if (!await this.saveFinalContentToBackend (
                    essayStore.unsentHistory,
                    essayStore.storedContent,
                    essayStore.storedHash,
                    authorize,
                )) {
                    this.review = true
                    this.showFinalizeFailure = true
                    this.showAuthorizeFailure = authorize
                    return;
                }
            }

            await settingsStore.clearStorage();
            await taskStore.clearStorage();
            await resourcesStore.clearStorage();
            await essayStore.clearStorage();
            await layoutStore.clearStorage();
            await alertStore.clearStorage();
            localStorage.clear();

            window.location = this.returnUrl;
        },

        /**
         * Retry the final transmission
         * This is called from the review screen
         * A retry should not authorize and close the writer
         * Instead the review screen is shown again and allows to auhorize
         */
        async retry() {

            const essayStore = useEssayStore();
            if (await this.saveFinalContentToBackend (
                essayStore.unsentHistory,
                essayStore.storedContent,
                essayStore.storedHash,
                false,
            )) {
                await essayStore.setAllSavingsSent();
            }
            else {
                this.showFinalizeFailure = true
            }

            this.review = true;
        },
    }
})
