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

import {useEssayStore} from '@/store/essay';
import {useSettingsStore} from "@/store/settings";
import {usePreferencesStore} from "@/store/preferences";
import {onMounted, watch} from 'vue';

const essayStore = useEssayStore();
const settingsStore = useSettingsStore();
const preferencesStore = usePreferencesStore();

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
  const editor = tinymce.get('essay');
  editor.contentWindow.document.body.style.fontSize=(preferencesStore.editor_zoom * 16) + 'px';
}


</script>

<template>
  <div id="app-essay-edit-wrapper">
    <editor
        id="essay"
        v-model="essayStore.currentContent"
        @change="essayStore.updateContent(true)"
        @keyup="essayStore.updateContent(true)"
        api-key="no-api-key"
        :init="{
          height: '100%',
          menubar: false,
          plugins: 'lists charmap paste',
          toolbar: settingsStore.tinyToolbar,
          valid_elements: settingsStore.tinyValidElements,
          formats: settingsStore.tinyFormats,
          custom_undo_redo_levels: 10,
          skin: false,                      //  avoid 404 errors for skin css files
          content_css: false,               // avoid 404 error for content css file
          content_style: contentUiCss.toString() + '\n' + contentLocalCss.toString(),
          paste_block_drop: true,
          setup: function (editor) {
              editor.ui.registry.addButton('zoomOut', {tooltip: 'Verkleinern', icon: 'zoom-out', onAction: zoomOut});
              editor.ui.registry.addButton('zoomIn', {tooltip: 'Vergrößern', icon: 'zoom-in', onAction: zoomIn});
            }
         }"
    />
  </div>
</template>

<style scoped>
  #app-essay-edit-wrapper {
    height: 100%
  }
</style>
