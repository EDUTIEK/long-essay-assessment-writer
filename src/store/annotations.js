import { defineStore } from "pinia";
import localForage from "localforage";
import {useApiStore} from "@/store/api";
import {useResourcesStore} from "@/store/resources";
import {useLayoutStore} from "@/store/layout";
import { useChangesStore } from "@/store/changes";
import Annotation from "@/data/Annotation";
import Change from '@/data/Change';
import resource from "@/data/Resource";


const storage = localForage.createInstance({
  storeName: "writer-annotations",
  description: "Writer annotations data",
});

function startState() {

  return {
    // saved in storage
    keys: [],                   // list of string keys
    annotations: [],            // list of all annotation objects

    // not saved in storage
    markerChange: 0,                // for watchers: timestamp of the last change that affects the text markers (not the selection)
    selectionChange: 0,             // for watchers: timestamp of the last change of the selected annotation
    caretRequest: 0,                // for watchers: timestamp of the last request to set the caret to the mark of selected comment

    selectedKey: '',                // key of the currently selected comment
    firstVisibleKey: '',            // key of the first visible comment in the scrolled text
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

    activeAnnotations: state => {
      const layoutStore = useLayoutStore();
      const shownResourceKey = layoutStore.shownResourceKey;
      if (shownResourceKey) {
        return state.annotations.filter(annotation => annotation.resource_key == shownResourceKey);
      }
      return [];
    },

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
     * Set the first visible annotation to force a scrolling
     * @param {string} key
     * @public
     */
    setFirstVisibleAnnotation(key) {
      this.firstVisibleKey = key;
    },


    /**
     * Set timestamp of the last change that affects the text markers (not the selection)
     * @public
     */
    setMarkerChange() {
      this.markerChange = Date.now();
    },

    /**
     * Set timestamp of the last request to set the carent to the selected comment
     * @public
     */
    setCaretRequest() {
      this.caretRequest = Date.now();
    },

    /**
     * Set the currently selected annotation
     * Call with set_change=true when a annotation is selected, added or removed
     * Call with set_change=false when just the key of the selected annotation is updated
     *
     * @param {string} key
     * @param {boolean} set_change
     * @public
     */
    selectAnnotation(key, set_change = true) {
      this.selectedKey = key;
      if (set_change) {
        this.selectionChange = Date.now();
      }
    },

    /**
     * Update an annotation in the store
     * @param {bool} trigger a sorting and labelling of the annotations
     * @param {Annotation} annotation
     * @public
     */
    async updateAnnotation(annotation, sort = false) {
      const apiStore = useApiStore();
      const changesStore = useChangesStore();

      if (this.keys.includes(annotation.getKey())
      ) {
        await storage.setItem(annotation.getKey(), JSON.stringify(annotation.getData()));
        await changesStore.setChange(new Change({
          type: Change.TYPE_ANNOTATIONS,
          action: Change.ACTION_SAVE,
          key: annotation.getKey()
        }))

        if (sort) {
          await this.sortAndLabelAnnotations();
          this.setMarkerChange();
        }
      }
    },

    /**
     * Delete an annotation
     *
     * @param {string} removeKey
     * @private
     */
    async deleteAnnotation(removeKey) {
      if (this.selectedKey == removeKey) {
        this.selectAnnotation('', true);
      }
      const annotation = this.annotations.find(element => element.getKey() == removeKey);

      this.annotations = this.annotations.filter(element => element.getKey() != removeKey);
      if (this.keys.includes(removeKey)) {
        this.keys = this.keys.filter(key => key != removeKey)
        await storage.setItem('keys', JSON.stringify(this.keys));
        await storage.removeItem(removeKey);
      }

      const changesStore = useChangesStore();
      const change = new Change({
        type: Change.TYPE_ANNOTATIONS,
        action: Change.ACTION_DELETE,
        key: annotation.getKey()
      });

      await changesStore.setChange(change);
      await this.sortAndLabelAnnotations();
      this.setMarkerChange();
    },


    /**
     * Sort and label the annotations of a resource by position
     * @private
     */
    async sortAndLabelAnnotations() {
      this.annotations = this.annotations.sort(compareAnnotations);

      let resource_key = '';
      let parent = 0;
      let number = 0;
      for (const annotation of this.annotations) {
        if (annotation.resource_key !== resource_key) {
          resource_key = annotation.resource_key;
          parent = 0;
          number = 1;
        }else if (annotation.parent_number > parent) {
          parent = annotation.parent_number;
          number = 1;
        } else {
          number++;
        }
        annotation.label = (parent + 1).toString() + '.' + number.toString();
      }
    },

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
        await this.sortAndLabelAnnotations();
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
        await this.sortAndLabelAnnotations();
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
          changes.push(apiStore.getChangeDataToSend(change, Annotation.getFromKey(change.key)));
        }
      }
      return changes;
    }
  }
});


/**
 * Compare two annotations for sorting
 * @param {Annotation} annotation1
 * @param {Annotation} annotation2
 */
const compareAnnotations = function (annotation1, annotation2) {
  if (annotation1.resource_key < annotation2.resource_key) {
    return -1;
  } else if (annotation1.resource_key > annotation2.resource_key) {
    return 1;
  } else if (annotation1.parent_number < annotation2.parent_number) {
    return -1;
  } else if (annotation1.parent_number > annotation2.parent_number) {
    return 1;
  } else if (annotation1.start_position < annotation2.start_position) {
    return -1;
  } else if (annotation1.start_position > annotation2.start_position) {
    return 1;
  } else {
    return 0;
  }
}
