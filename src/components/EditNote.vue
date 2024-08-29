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

import {useNotesStore} from '@/store/notes';
import {useSettingsStore} from "@/store/settings";
import {usePreferencesStore} from "@/store/preferences";
import {useClipbardStore} from "@/store/clipboard";

import {onMounted, watch} from 'vue';

const notesStore = useNotesStore();
const settingsStore = useSettingsStore();
const preferencesStore = usePreferencesStore();
const clipboardStore =useClipbardStore();

const props = defineProps(['noteKey', 'noteLabel']);

onMounted(() => {
  applyZoom();
});
watch(() => preferencesStore.editor_zoom, applyZoom);

function zoomIn() {
  preferencesStore.zoomEditorIn();
}

function zoomOut() {
  preferencesStore.zoomEditorOut();
}

function applyZoom() {
  const editor = tinymce.get(props.noteKey);
  editor.contentWindow.document.body.style.fontSize= (preferencesStore.editor_zoom * 16) + 'px';
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
  <div id="app-note-edit-wrapper">
    <label :for="props.noteKey" class="sr-only">{{ 'Editor ' + props.noteLabel }}</label>
    <editor
      :id="props.noteKey"
      v-model="notesStore.editNotes[props.noteKey].note_text"
      @change="notesStore.updateContent(true)"
      @keyup="notesStore.updateContent(true)"
      @copy="handleCopy"
      @cut="handleCopy"
      api-key="no-api-key"
      :init="{
        height: '100%',
        menubar: false,
        plugins: 'lists charmap paste help',
        toolbar: settingsStore.tinyToolbar,
        valid_elements: settingsStore.tinyValidElements,
        formats: settingsStore.tinyFormats,
        custom_undo_redo_levels: 10,
        skin: false,                      // avoid 404 errors for skin css files
        content_css: false,               // avoid 404 error for content css file
        content_style: settingsStore.tinyContentStyle,
        paste_block_drop: true,
        paste_convert_word_fake_lists: false,
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

<style scoped>
#app-note-edit-wrapper {
  height: 100%
}

</style>
