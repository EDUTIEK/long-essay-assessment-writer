<script setup>
/*
* Import TinyMCE
* @see https://www.tiny.cloud/docs/tinymce/latest/vite-es6-npm/
*/
import tinymce from 'tinymce';

/* Default icons are required. After that, import custom icons if applicable */
import 'tinymce/icons/default/icons.min.js';

/* Required TinyMCE components */
import 'tinymce/themes/silver/theme.min.js';
import 'tinymce/models/dom/model.min.js';

/* Import a skin (can be a custom skin instead of the default) */
import 'tinymce/skins/ui/oxide/skin.js';

/* Import plugins */
import '@/plugins/tiny_de.js';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/help/js/i18n/keynav/en.js';
import 'tinymce/plugins/help/js/i18n/keynav/de.js';
import 'tinymce/plugins/help';

/* content UI CSS is required */
import 'tinymce/skins/ui/oxide/content.js';

/* The default content CSS can be changed or replaced with appropriate CSS for the editor content. */
import 'tinymce/skins/content/default/content.js';

// Import tiny vue integration
import Editor from '@tinymce/tinymce-vue'

import {useEssayStore} from '@/store/essay';
import {useSettingsStore} from "@/store/settings";
import {usePreferencesStore} from "@/store/preferences";
import {useClipbardStore} from "@/store/clipboard";

import {onMounted, watch} from 'vue';

const essayStore = useEssayStore();
const settingsStore = useSettingsStore();
const preferencesStore = usePreferencesStore();
const clipboardStore =useClipbardStore();

function handleInit() {
  applyZoom();
  applyFormat();
}
watch(() => preferencesStore.editor_zoom, applyZoom);
watch(() =>settingsStore.contentClass, applyFormat);

function zoomIn() {
  preferencesStore.zoomEditorIn();
}

function zoomOut() {
  preferencesStore.zoomEditorOut();
}

function applyZoom() {
  const editor = tinymce.get('essay');
  editor.dom.setStyle(editor.dom.doc.body, 'font-size', (preferencesStore.editor_zoom * 16) + 'px');
}

/**
 * Add classes for the headline styles to the overlay element of the tiny menu
 */
function applyFormat() {
  for (const element of document.getElementsByClassName('tox-tinymce-aux')) {
    element.classList.add(settingsStore.contentClass);
  }
}

/**
 * Handle copy to the clipboard
 * @param {ClipboardEvent} event
 */
function handleCopy(event) {
  clipboardStore.setContent(event.clipboardData.getData('text/html'));
}

/**
 * Check if paste is alloed (called from tiny plugin)
 */
function handlePaste(plugin, args) {

  if (!clipboardStore.getPasteAllowed(args.content)) {
    args.content='';
    clipboardStore.showWarning();
  }
}

</script>

<template>
  <div id="app-essay-edit-wrapper">
    <label for="essay" class="sr-only">Editor Abgabe-Text</label>
    <editor
        id="essay"
        v-model="essayStore.currentContent"
        @change="essayStore.updateContent(true)"
        @keyup="essayStore.updateContent(true)"
        @copy="handleCopy"
        @cut="handleCopy"
        @init="handleInit"
        api-key="no-api-key"
        :init="{
          license_key: 'gpl',
          language: 'de',
          height: '100%',
          menubar: false,
          plugins: 'lists charmap help',
          toolbar: settingsStore.tinyToolbar,
          valid_elements: settingsStore.tinyValidElements,
          formats: settingsStore.tinyFormats,
          style_formats: settingsStore.tinyStyles,
          custom_undo_redo_levels: 10,
          skin: 'default',
          content_css: 'default',
          content_style: settingsStore.tinyContentStyle,
          browser_spellcheck: settingsStore.allow_spellcheck,
          paste_block_drop: true,
          paste_as_text: false,
          paste_preprocess: handlePaste,
          help_tabs: [
            'shortcuts',
            'keyboardnav'
          ],
          setup: function (editor) {
              editor.ui.registry.addButton('zoomOut', {tooltip: 'Verkleinern', icon: 'zoom-out', onAction: zoomOut});
              editor.ui.registry.addButton('zoomIn', {tooltip: 'Vergrößern', icon: 'zoom-in', onAction: zoomIn});
            }
         }"
    />
  </div>

</template>

<style>

/**
 * Styles for tiny must be global
 */

/* hide the statusbar */
.tox-statusbar {
  display: none!important;
}

</style>

<style scoped>
  #app-essay-edit-wrapper {
    height: 100%
  }
</style>
