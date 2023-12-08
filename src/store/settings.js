import { defineStore } from 'pinia';
import localForage from "localforage";

import contentUiCss from 'tinymce/skins/ui/oxide/content.css';
import contentLocalCss from '@/styles/content.css';
//import headlinesNumericCss from '@/substyles/headlines-numeric.css';

const storage = localForage.createInstance({
    storeName: "writer-settings",
    description: "Settings data",
});

/**
 * Settings Store
 * Handles the editor settings of the writing task
 */
export const useSettingsStore = defineStore('settings',{
    state: () => {
        return {
            // saved in storage
            headline_scheme: null,          // identifier (string) of the CSS scheme used for headlines
            formatting_options: null,       // identifier (string) if the available formatting otions
            notice_boards: null,            // number (int) of available notice boards
            copy_allowed: null,             // flag (bool) if copy/paste from other web sites should be allowed
            primary_color: null,            // color for the background of primary actions
            primary_text_color: null,       // color for the text of primary actions
        }
    },

    getters: {

      hasNotes: state => state.notice_boards > 0,

      primaryColorCss: state => {
            if (state.primary_color) {
                return '#' + state.primary_color
            }
            return '';
        },

        primaryTextColorCss: state => {
            if (state.primary_text_color) {
                return '#' + state.primary_text_color
            }
            return '';
        },

        primaryTextColorFullCss: state => {
            if (state.primary_text_color) {
                return 'color: #' + state.primary_text_color + ';'
            }
            return '';
        },

        tinyToolbar: state => {
          switch (state.formatting_options)
          {
            case 'full':
              return 'zoomOut zoomIn | undo redo | formatselect | bold italic underline | bullist numlist | removeformat | charmap | paste';
            case 'medium':
              return 'zoomOut zoomIn | undo redo | bold italic underline | bullist numlist | removeformat | charmap | paste';
            case 'minimal':
              return 'zoomOut zoomIn | undo redo | bold italic underline | removeformat | charmap | paste';
            case 'none':
            default:
              return 'zoomOut zoomIn | undo redo | charmap |paste';
          }
        },

      /**
       * @see https://www.tiny.cloud/docs/configure/content-filtering/#valid_elements
       */
      tinyValidElements: state => {
          switch (state.formatting_options)
          {
            case 'full':
              return 'p/div,br,strong/b,em/i,u,ol,ul,li,h1,h2,h3,h4,h5,h6,pre';
            case 'medium':
              return 'p/div,br,strong/b,em/i,u,ol,ul,li';
            case 'minimal':
              return 'p/div,p/li,br,strong/b,em/i,u';
            case 'none':
            default:
              return 'p/div,p/li,br';
          }

        },


      /**
       * @see https://www.tiny.cloud/docs/configure/content-formatting/#formats
       */
      tinyFormats: state => {
        return {
          underline: {inline: 'u', remove: 'all'}
        }
      },

      tinyContentStyle: state => {
        return contentUiCss.toString() + '\n' + state.contentStyle;
      },

      contentStyle: state => {
        const baseStyle = contentLocalCss.toString();

        switch (state.headline_scheme) {
          // case 'numeric':
          //   return baseStyle + '\n' + headlinesNumericCss.toString();

          default:
            return baseStyle;
        }
      }
    },

    actions: {
        setData(data) {
            this.headline_scheme = data.headline_scheme;
            this.formatting_options = data.formatting_options;
            this.notice_boards = data.notice_boards;
            this.copy_allowed = data.copy_allowed;
            this.primary_color = data.primary_color;
            this.primary_text_color = data.primary_text_color;
        },

        async clearStorage() {
            try {
                await storage.clear();
            }
            catch (err) {
                console.log(err);
            }
        },


        async loadFromStorage() {
            try {
                const data = await storage.getItem('settings');
                this.setData(data);
            } catch (err) {
                console.log(err);
            }
        },

        async loadFromData(data) {
            try {
                await storage.setItem('settings', data);
                this.setData(data);
            } catch (err) {
                console.log(err);
            }
        }
    }
});
