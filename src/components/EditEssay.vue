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
import 'tinymce/plugins/wordcount';

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
  applyWordCount();
}
watch(() => preferencesStore.editor_zoom, applyZoom);
watch(() => settingsStore.contentClass, applyFormat);
watch(() => preferencesStore.word_count_enabled, applyWordCount);

function applyZoom() {
  try {
    const editor = tinymce.get('essay');
    if (editor) {
      editor.dom.setStyle(editor.dom.doc.body, 'font-size', (preferencesStore.editor_zoom) + 'rem');
      editor.dom.setStyle(editor.dom.select('h1'),
        'font-size',
        (preferencesStore.editor_zoom * settingsStore.tinyH1Size) + 'rem');
      editor.dom.setStyle(editor.dom.select('h2'),
        'font-size',
        (preferencesStore.editor_zoom * settingsStore.tinyH2Size) + 'rem');
      editor.dom.setStyle(editor.dom.select('h3'), 'font-size', (preferencesStore.editor_zoom) + 'rem');
      editor.dom.setStyle(editor.dom.select('h4'), 'font-size', (preferencesStore.editor_zoom) + 'rem');
      editor.dom.setStyle(editor.dom.select('h5'), 'font-size', (preferencesStore.editor_zoom) + 'rem');
      editor.dom.setStyle(editor.dom.select('h6'), 'font-size', (preferencesStore.editor_zoom) + 'rem');
    }
  }
  catch(e) {
    // prevent error when tiny is unloaded
  }
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
 * Set the visibility of the word counter
 */
function applyWordCount() {
  for (const element of document.getElementsByClassName('tox-statusbar')) {
    if (preferencesStore.word_count_enabled) {
      element.classList.remove('hidden');
    }
    else {
      element.classList.add('hidden');
    }
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
 * Check if paste is allowed (called from tiny plugin)
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
    <label for="essay" class="hidden">Verborgenes Feld zum Abgabe-Text</label>
    <editor
        id="essay"
        v-model="essayStore.currentContent"
        @change="applyZoom(); essayStore.updateContent(true)"
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
          statusbar: true,
          elementpath: false,
          branding: false,
          resize: false,
          plugins: 'lists charmap wordcount',
          toolbar: settingsStore.tinyToolbar,
          valid_elements: settingsStore.tinyValidElements,
          formats: settingsStore.tinyFormats,
          style_formats: settingsStore.tinyStyles,
          custom_undo_redo_levels: 10,
          skin: 'default',
          content_css: 'default',
          content_style: settingsStore.tinyContentStyle,
          browser_spellcheck: settingsStore.allow_spellcheck,
          highlight_on_focus: true,
          iframe_aria_text: 'Editor Abgabe-Text',
          paste_as_text: false,         // keep formats when copying between clipboards
          paste_block_drop: true,       // prevent unfiltered content from drag & drop
          paste_merge_formats: true,    // default
          paste_tab_spaces: 4,          // default
          smart_paste: false,           // don't create hyperlinks automatically
          paste_data_images: false,     // don't paste images
          paste_remove_styles_if_webkit: true,  // default
          paste_webkit_styles: 'none',          // default
          paste_preprocess: handlePaste
         }"
    />
  </div>

</template>

<style scoped>
  #app-essay-edit-wrapper {
    height: 100%
  }
</style>
