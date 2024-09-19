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

import {useNotesStore} from '@/store/notes';
import {useSettingsStore} from "@/store/settings";
import {usePreferencesStore} from "@/store/preferences";
import {useClipbardStore} from "@/store/clipboard";
import {useLayoutStore} from "@/store/layout";
import { onMounted, watch, ref, nextTick } from 'vue';

const notesStore = useNotesStore();
const settingsStore = useSettingsStore();
const preferencesStore = usePreferencesStore();
const clipboardStore =useClipbardStore();
const layoutStore = useLayoutStore();

const props = defineProps(['noteKey', 'noteLabel']);

const wordCount = ref(0);
const characterCount = ref(0);

function handleInit() {
  applyZoom();
  applyFormat();
  updateWordCount();
}
watch(() => preferencesStore.editor_zoom, applyZoom);
watch(() => settingsStore.contentClass, applyFormat);

async function handleFocusChange() {
  if (layoutStore.focusTarget == 'right' && layoutStore.isNotesSelected) {
    await nextTick();
    const editor = tinymce.get('app-note-' + notesStore.activeKey);
    if (editor) {
      editor.focus();
    }
  }
}
watch(() => layoutStore.focusChange, handleFocusChange);

function handleChange() {
  notesStore.updateContent(true);
  applyZoom();
  updateWordCount();
}

function handleKeyUp() {
  notesStore.updateContent(true);
  updateWordCount();
}

function applyZoom() {
  try {
    const editor = tinymce.get('app-note-' + props.noteKey);
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

function updateWordCount() {
  try {
    const editor = tinymce.get('app-note-' + props.noteKey);
    if (editor) {
      const plugin = editor.plugins.wordcount;
      wordCount.value = plugin.body.getWordCount();
      characterCount.value = plugin.body.getCharacterCount();
    }
  }
  catch(e) {
    // prevent error when tiny is unloaded
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
  <div id="app-note-edit-wrapper">
    <label class="hidden" :for="props.noteKey">{{ 'Verborgenes Feld zur ' + props.noteLabel }}</label>
    <div class="tinyWrapper">
      <editor
        :id="'app-note-' + props.noteKey"
        v-model="notesStore.editNotes[props.noteKey].note_text"
        @change="handleChange"
        @keydown="layoutStore.handleKeyDown"
        @keyup="handleKeyUp"
        @copy="handleCopy"
        @cut="handleCopy"
        @init="handleInit"
        api-key="no-api-key"
        :init="{
           license_key: 'gpl',
            language: 'de',
            height: '100%',
            menubar: false,
            statusbar: false,
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
            iframe_aria_text: 'Editor ' + props.noteLabel,
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
    <div v-show="preferencesStore.word_count_enabled" class="wordCountWrapper">
      <v-btn variant="text" size="small" @click="preferencesStore.toggleWordCountCharacters()"
             :text = "preferencesStore.word_count_characters ? characterCount + ' Zeichen' : wordCount + ' Wörter' ">
      </v-btn>
    </div>
  </div>
</template>

<style scoped>
  #app-note-edit-wrapper {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .tinyWrapper {
    flex-grow: 1;
  }

  .wordCountWrapper {
    height: 30px;
    border: 1px solid #cccccc;
    border-top: 0;
    font-size: 16px;
  }

</style>
