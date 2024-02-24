import { defineStore } from 'pinia';
import localForage from "localforage";

// use '?inline' to prevent these styles from being automatically added to the whole page
import contentUiCss from 'tinymce/skins/ui/oxide/content.css?inline';
import contentLocalCss from '@/styles/content.css?inline';
import headlinesSingleCss from '@/styles/headlines-single.css?inline';
import headlinesThreeCss from '@/styles/headlines-three.css?inline';
import headlinesNumericCss from '@/styles/headlines-numeric.css?inline';
import headlinesEdutiekCss from '@/styles/headlines-edutiek.css?inline';

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
            notice_boards: 0,               // number (int) of available notice boards
            copy_allowed: false,            // flag (bool) if copy/paste from other websites should be allowed
            primary_color: null,            // color for the background of primary actions
            primary_text_color: null,       // color for the text of primary actions
            allow_spellcheck: false         // flag (bool) if spellcheck by browser is allowed
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
              return 'zoomOut zoomIn | undo redo | styleselect | bold italic underline | bullist numlist | removeformat | charmap | paste';
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

      tinyStyles: state => {
        switch (state.headline_scheme) {
          case 'single':
            return [
              {title: 'Absatz', format: 'p'},
              {title: 'Überschrift', format: 'h1'},
              {title: 'Maschinenschrift', format: 'pre'},
              {title: 'Listenelement', block: 'li'},
            ];
          case 'three':
            return [
              {title: 'Absatz', format: 'p'},
              {title: 'Überschrift 1', format: 'h1'},
              {title: 'Überschrift 2', format: 'h2'},
              {title: 'Überschrift 3', format: 'h3'},
              {title: 'Maschinenschrift', format: 'pre'},
              {title: 'Listenelement', block: 'li'},
            ];
          default:
            return [
              {title: 'Absatz', format: 'p'},
              {title: 'Überschrift 1', format: 'h1'},
              {title: 'Überschrift 2', format: 'h2'},
              {title: 'Überschrift 3', format: 'h3'},
              {title: 'Überschrift 4', format: 'h4'},
              {title: 'Überschrift 5', format: 'h5'},
              {title: 'Überschrift 6', format: 'h6'},
              {title: 'Maschinenschrift', format: 'pre'},
              {title: 'Listenelement', block: 'li'},
            ];
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
        const baseStyle = contentUiCss.toString() + '\n' +  contentLocalCss.toString();

        switch (state.headline_scheme) {
          case 'single':
            return baseStyle + '\n' + headlinesSingleCss.toString();
          case 'three':
            return baseStyle + '\n' + headlinesThreeCss.toString();
          case 'numeric':
            return baseStyle + '\n' + headlinesNumericCss.toString();
          case 'edutiek':
            return baseStyle + '\n' + headlinesEdutiekCss.toString();
          default:
            return baseStyle;
        }
      },

      contentClass: state => {
        switch (state.headline_scheme) {
          case 'single':
            return 'headlines-single';
          case 'three':
            return 'headlines-three';
          case 'numeric':
            return 'headlines-numeric';
          case 'edutiek':
            return 'headlines-edutiek';
          default:
            return '';
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
            this.allow_spellcheck = data.allow_spellcheck;
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
