import { defineStore } from 'pinia';
import localForage from "localforage";
import { useChangesStore } from "@/store/changes";
import { useApiStore } from '@/store/api';
import Change from '@/data/Change';


const storage = localForage.createInstance({
  storeName: "writer-preferences",
  description: "Preferences data",
});

/**
 * Preferences Store
 * Stores local setings done by the corrector
 * These settings are not yet sent to the backend
 */
export const usePreferencesStore = defineStore('preferences', {
  state: () => {
    return {
      // saved in storage
      instructions_zoom: 0.25,                            // zoom level of the istructions
      editor_zoom: 1                                     // zoom level of the editors (essay and notes)
    }
  },

  getters: {

    allData: state => {
      return {
        instructions_zoom: state.instructions_zoom,
        editor_zoom: state.editor_zoom
      }
    },
  },

  actions: {

    async clearStorage() {
      try {
        await storage.clear();
      }
      catch (err) {
        console.log(err);
      }
      this.$reset();
    },

    async loadFromStorage() {
      try {
        const data = await storage.getItem('preferences');
        if (data) {
          this.$patch(data);
        }
      }
      catch (err) {
        console.log(err);
      }
    },

    async saveToStorage() {
      try {
        await storage.setItem('preferences', this.allData);
      }
      catch (err) {
        console.log(err);
      }
    },

    loadFromData(data) {
      try {
        this.$patch(data);
        this.sent = true;
        this.saveToStorage();

      }
      catch (err) {
        console.log(err);
      }
    },

    /**
     * Update the preferences in the sorage and mark them as changed
     */
    async update() {
      const changesStore = useChangesStore();
      const apiStore = useApiStore();

      await this.saveToStorage();
      await changesStore.setChange(new Change({
        type: Change.TYPE_PREFERENCES,
        action: Change.ACTION_SAVE,
        key: 'preferences',         // fixed key, old change will be updated
      }))
    },

    /**
     * Get the changed preferences as flat data object
     * This is called for sending the preferences to the backend
     * @param {integer} sendingTime - timestamp of the sending or 0 to get all
     * @return {array} Change objects
     */
    async getChangedData(sendingTime = 0) {
      const apiStore = useApiStore();
      const changesStore = useChangesStore();
      const changes = [];
      for (const change of changesStore.getChangesFor(Change.TYPE_PREFERENCES, sendingTime)) {
        // preferences exist only once, will be the same for all changes
        changes.push(apiStore.getChangeDataToSend(change, this.allData));
      };
      return changes;
    },

    zoomInstructionsIn() {
      this.instructions_zoom = this.instructions_zoom * 1.1;
      this.update();
    },

    zoomInstructionsOut() {
      this.instructions_zoom = this.instructions_zoom * 0.9;
      this.update();
    },

    zoomEditorIn() {
      this.editor_zoom = this.editor_zoom * 1.1;
      this.update();
    },

    zoomEditorOut() {
      this.editor_zoom = this.editor_zoom * 0.9;
      this.update();
    }

  },
});
