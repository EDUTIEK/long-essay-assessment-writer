import { defineStore } from 'pinia';
import {useSettingsStore} from "@/store/settings";

/**
 * Clipboard Store
 */
export const useClipbardStore = defineStore('clipboard', {
  state: () => {
    return {
      content: '',
      show_warning: false
    }
  },

  getters: {

    getPasteAllowed: state => {

      /**
       * Check if paste of a certain content is allowed
       * This is allowed if the content comes from the instructions or from the editors
       *
       * @param {string} content
       * @return {boolean}
       */
      const fn = function (content) {

        const settingsStore = useSettingsStore();
        if (settingsStore.copy_allowed) {
          return true;
        }

        //console.log(content);
        //console.log(state.content);

        if (content == state.content) {
          return true;
        }
        return false;

      };
      return fn;
    },
  },

  actions: {

    /**
     * Set the allowed clipboard content
     * @param content
     */
    setContent(content) {
      //console.log(content);
      this.content = content;
    },

    showWarning() {
      this.show_warning = true;
    },

    hideWarning() {
      this.show_warning = false;
    },

  }
});
