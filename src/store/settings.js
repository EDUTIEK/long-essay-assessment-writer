import { defineStore } from 'pinia';
import localForage from "localforage";
import i18n from "@/plugins/i18n";

import contentLocalCss from '@/styles/content.css?inline';
import headlinesSingleCss from '@/styles/headlines-single.css?inline';
import headlinesThreeCss from '@/styles/headlines-three.css?inline';
import headlinesNumericCss from '@/styles/headlines-numeric.css?inline';
import headlinesEdutiekCss from '@/styles/headlines-edutiek.css?inline';

const storage = localForage.createInstance({
  storeName: "writer-settings",
  description: "Settings data",
});


const { t } = i18n.global

/**
 * Settings Store
 * Handles the editor settings of the writing task
 */
export const useSettingsStore = defineStore('settings', {
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
      switch (state.formatting_options) {
        case 'full':
          return 'undo redo styles bold italic underline bullist numlist removeformat charmap wordcount';
        case 'medium':
          return 'undo redo bold italic underline bullist numlistremoveformat charmap wordcount';
        case 'minimal':
          return 'undo redo bold italic underline removeformat charmap wordcount';
        case 'none':
        default:
          return 'undo redo charmap wordcount';
      }
    },

    /**
     * @see https://www.tiny.cloud/docs/configure/content-filtering/#valid_elements
     */
    tinyValidElements: state => {
      switch (state.formatting_options) {
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

    tinyH1Size: state => state.headline_scheme == 'three' ? 1.3 : 1,
    tinyH2Size: state => state.headline_scheme == 'three' ? 1.15 : 1,

    tinyStyles: state => {
      switch (state.headline_scheme) {
        case 'single':
          return [
            { title: t('settingsParagraph'), format: 'p' },
            { title: t('settingsHeading'), format: 'h1' },
            { title: t('settingsTypewriter'), format: 'pre' },
            { title: t('settingsListElement'), block: 'li' },
          ];
        case 'three':
          return [
            { title: t('settingsParagraph'), format: 'p' },
            { title: t('settingsHeading1'), format: 'h1' },
            { title: t('settingsHeading2'), format: 'h2' },
            { title: t('settingsHeading3'), format: 'h3' },
            { title: t('settingsTypewriter'), format: 'pre' },
            { title: t('settingsListElement'), block: 'li' },
          ];
        default:
          return [
            { title: t('settingsParagraph'), format: 'p' },
            { title: t('settingsHeading1'), format: 'h1' },
            { title: t('settingsHeading2'), format: 'h2' },
            { title: t('settingsHeading3'), format: 'h3' },
            { title: t('settingsHeading4'), format: 'h4' },
            { title: t('settingsHeading5'), format: 'h5' },
            { title: t('settingsHeading6'), format: 'h6' },
            { title: t('settingsTypewriter'), format: 'pre' },
            { title: t('settingsListElement'), block: 'li' },
          ];
      }
    },

    /**
     * @see https://www.tiny.cloud/docs/configure/content-formatting/#formats
     */
    tinyFormats: state => {
      return {
        underline: { inline: 'u', remove: 'all' }
      }
    },

    tinyContentStyle: state => {
      const baseStyle = contentLocalCss.toString();

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
      }
      catch (err) {
        console.log(err);
      }
    },

    async loadFromData(data) {
      try {
        await storage.setItem('settings', data);
        this.setData(data);
      }
      catch (err) {
        console.log(err);
      }
    }
  }
});
