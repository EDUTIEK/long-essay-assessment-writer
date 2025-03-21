import { defineStore } from "pinia";
import localForage from "localforage";
import {useApiStore} from "@/store/api";
import { useChangesStore } from "@/store/changes";
import Annotation from "@/data/Annotation";
import Change from '@/data/Change';


const storage = localForage.createInstance({
  storeName: "writer-annotations",
  description: "Writer annotations data",
});

function startState() {

  return {
    // saved in storage
    keys: [],                   // list of string keys
    annotations: [],            // list of all annotation objects
  }
}

/**
 * Annotations Store
 */
export const useAnnotationsStore = defineStore('annotations', {
  state: () => {
    return startState();
  },

  /**
   * Getter functions (with params) start with 'get', simple state queries not
   */
  getters: {

    getAnnotationsForResource: state => {

      /**
       * Get the annotations for a resource
       * @param {string} resource_key
       */
      const fn = function (resource_key) {
        return state.annotations.filter(element => element.resource_key === resource_key);
      }
      return fn;
    },
  },


  actions: {

    /**
     * Clear the whole storage
     * @public
     */
    async clearStorage() {
      try {
        await storage.clear();
      }
      catch (err) {
        console.log(err);
      }
      this.$reset();
    },


    /**
     * Load the notes data from the storage
     * @public
     */
    async loadFromStorage() {

      try {
        this.$reset();

        const keys = await storage.getItem('keys');
        if (keys) {
          this.keys = JSON.parse(keys);
        }

        for (const key of this.keys) {
          const stored = await storage.getItem(key);
          if (stored) {
            const parsed = JSON.parse(stored);
            if (typeof parsed === 'object' && parsed !== null) {
              const annotation = new Annotation(parsed);
              this.annotations.push(annotation);
            }
          }
        }

      }
      catch (err) {
        console.log(err);
      }
    },

    /**
     * Load the annotations data from the backend
     * All keys and annotations are put to the storage
     *
     * @param {array} data - array of plain objects
     * @public
     */
    async loadFromData(data) {
      try {
        await storage.clear();
        this.$reset();

        for (const annotation_data of data) {
          const annotation = new Annotation(annotation_data);
          this.annotations.push(annotation);

          this.keys.push(annotation.getKey());
          await storage.setItem(annotation.getKey(), JSON.stringify(annotation.getData()));
        }
        ;
        await storage.setItem('keys', JSON.stringify(this.keys));
      }
      catch (err) {
        console.log(err);
      }
    },

    /**
     * Save the annotations of a resource key
     * @param resource_key
     * @param annotations
     * @returns {Promise<void>}
     */
    async saveAnnotationsForResource(resource_key, annotations)
    {
      const changesStore = useChangesStore();

      const old_annos = this.annotations.filter(element => element.resource_key === resource_key);
      const new_keys = annotations.map(element => element.getKey());

      // delete old annotations that no longer exist
      for (const old_annotation of old_annos) {
        if (!new_keys.includes(old_annotation.getKey())) {
          this.annotations = this.annotations.filter(element => element.getKey() !== old_annotation.getKey());
          this.keys = this.keys.filter(element => element !== old_annotation.getKey());
          await storage.removeItem(old_annotation.getKey());
          await changesStore.setChange(new Change({
            type: Change.TYPE_ANNOTATIONS,
            action: Change.ACTION_DELETE,
            key: old_annotation.getKey(),
            payload: {resource_key: old_annotation.resource_key, mark_key: old_annotation.mark_key}
          }));
        }
      }

      // save changed or new annotations
      for (const annotation of annotations) {
        const existing = this.annotations.find(element => element.getKey() == annotation.getKey());
        if (existing) {
          if (existing.getSignature() !== annotation.getSignature()) {
            existing.setData(annotation.getData());
            await storage.setItem(existing.getKey(), JSON.stringify(existing.getData()));
            await changesStore.setChange(new Change({
              type: Change.TYPE_ANNOTATIONS,
              action: Change.ACTION_SAVE,
              key: existing.getKey()
            }));
          }
        }
        else {
          this.annotations.push(annotation);
          this.keys.push(annotation.getKey());
          await storage.setItem(annotation.getKey(), JSON.stringify(annotation.getData()));
          await changesStore.setChange(new Change({
            type: Change.TYPE_ANNOTATIONS,
            action: Change.ACTION_SAVE,
            key: annotation.getKey(),
          }));
        }
      }

    },

    /**
     * Get all changed annotations from the storage as flat data objects
     * This is called for sending the annotations to the backend
     * @param {integer} sendingTime - timestamp of the sending or 0 to get all
     * @return {array} Change objects
     */
    async getChangedData(sendingTime = 0) {
      const apiStore = useApiStore();
      const changesStore = useChangesStore();
      const changes = [];
      for (const change of changesStore.getChangesFor(Change.TYPE_ANNOTATIONS, sendingTime)) {
        const data = await storage.getItem(change.key);
        if (data) {
          changes.push(apiStore.getChangeDataToSend(change, JSON.parse(data)));
        } else {
          changes.push(apiStore.getChangeDataToSend(change));
        }
      }
      return changes;
    }
  }
});
