<script setup>
/*
* Import TinyMCE
*/
import 'tinymce';
// Default icons are required for TinyMCE 5.3 or above
import 'tinymce/icons/default';
// A theme is also required
import 'tinymce/themes/silver';
// Import the skin
import 'tinymce/skins/ui/oxide/skin.css';
// Import plugins
import 'tinymce/plugins/lists';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/paste';
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

onMounted(() => {
  applyZoom();
  applyFormat();
});
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
  editor.contentWindow.document.body.style.fontSize=(preferencesStore.editor_zoom * 16) + 'px';
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
    <editor
        id="essay"
        v-model="essayStore.currentContent"
        @change="essayStore.updateContent(true)"
        @keyup="essayStore.updateContent(true)"
        @copy="handleCopy"
        @cut="handleCopy"
        api-key="no-api-key"
        :init="{
          height: '100%',
          menubar: false,
          plugins: 'lists charmap paste',
          toolbar: settingsStore.tinyToolbar,
          valid_elements: settingsStore.tinyValidElements,
          formats: settingsStore.tinyFormats,
          style_formats: settingsStore.tinyStyles,
          custom_undo_redo_levels: 10,
          skin: false,                      //  avoid 404 errors for skin css files
          content_css: false,               // avoid 404 error for content css file
          content_style: settingsStore.tinyContentStyle,
          browser_spellcheck: settingsStore.allow_spellcheck,
          paste_block_drop: true,
          paste_preprocess: handlePaste,
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
