import { defineStore } from "pinia";
import localForage from "localforage";

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
    async saveAnnotationsForResource(resource_key, annotations) {

      const old_annos = this.annotations.filter(element => element.resource_key === resource_key);
      const other_annos = this.annotations.filter(element => element.resource_key !== resource_key);

      this.$reset();

      this.annotations = annotations.concat(other_annos);
      this.keys = this.annotations.map(element => element.getKey());

      for (const annotation of old_annos) {
        await storage.removeItem(annotation.getKey());
      }

      for (const annotation of this.annotations) {
        await storage.setItem(annotation.getKey(), JSON.stringify(annotation.getData()));
      }
      await storage.setItem('keys', JSON.stringify(this.keys));
    }
  }
});
