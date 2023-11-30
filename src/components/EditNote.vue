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

/* Import content css */
import contentUiCss from 'tinymce/skins/ui/oxide/content.css';
import contentLocalCss from '@/styles/content.css';

/* Import plugins */
import 'tinymce/plugins/lists';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/paste';
/* Import tiny vue integration */
import Editor from '@tinymce/tinymce-vue'

import {useNotesStore} from '@/store/notes';
const notesStore = useNotesStore();

import {useSettingsStore} from "../store/settings";
const settingsStore = useSettingsStore();

const props = defineProps(['noteKey']);

function toolbar() {
  switch (settingsStore.formatting_options)
  {
    case 'full':
      return 'undo redo | formatselect | bold italic underline | bullist numlist | removeformat | charmap | paste';
    case 'medium':
      return 'undo redo | bold italic underline | bullist numlist | removeformat | charmap | paste';
    case 'minimal':
      return 'undo redo | bold italic underline | removeformat | charmap | paste';
    case 'none':
    default:
      return 'undo redo | charmap |paste';
  }
}

/**
 * @see https://www.tiny.cloud/docs/configure/content-filtering/#valid_elements
 */
function validElements() {
  switch (settingsStore.formatting_options)
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
}

/**
 * @see https://www.tiny.cloud/docs/configure/content-formatting/#formats
 */
function formats() {
  return {
    underline: {inline: 'u', remove: 'all'}
  }
}


</script>

<template>
  <div id="app-note-edit-wrapper">
    <editor
      :id="props.noteKey"
      v-model="notesStore.editNotes[props.noteKey].note_text"
      @change="notesStore.updateContent(true)"
      @keyup="notesStore.updateContent(true)"
      api-key="no-api-key"
      :init="{
        height: '100%',
        menubar: false,
        plugins: 'lists charmap paste',
        toolbar: toolbar(),
        valid_elements: validElements(),
        formats: formats(),
        custom_undo_redo_levels: 10,
        skin: false,                      //  avoid 404 errors for skin css files
        content_css: false,               // avoid 404 error for content css file
        content_style: contentUiCss.toString() + '\n' + contentLocalCss.toString(),
        paste_block_drop: true
       }"
    />
  </div>

</template>

<style scoped>
#app-note-edit-wrapper {
  height: 100%
}

</style>
