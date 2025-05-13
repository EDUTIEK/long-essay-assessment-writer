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
import TinyHelper from '@/lib/TinyHelper';

import { useEssayStore } from '@/store/essay';
import { useSettingsStore } from "@/store/settings";
import { usePreferencesStore } from "@/store/preferences";
import { useLayoutStore } from "@/store/layout";
import { watch } from 'vue';

const essayStore = useEssayStore();
const settingsStore = useSettingsStore();
const preferencesStore = usePreferencesStore();
const layoutStore = useLayoutStore();

const helper = new TinyHelper('app-essay');

watch(() => settingsStore.contentClass, helper.applyFormat.bind(helper));
watch(() => preferencesStore.editor_zoom, helper.applyZoom.bind(helper));
watch(() => layoutStore.focusChange, handleFocusChange);

async function handleFocusChange() {
  if (layoutStore.focusTarget == 'right' && layoutStore.isEssayVisible) {
    helper.applyFocus();
  }
}

function handleInit() {
  helper.init();
}

function handleChange() {
  essayStore.updateContent(true);
  helper.applyZoom();
  helper.applyWordCount();
  helper.applyScrolling();
}

function handleKeyUp() {
  essayStore.updateContent(true);
  helper.applyWordCount();
  helper.applyScrolling();
}

</script>

<template>
  <div id="app-essay-edit-wrapper">
    <label for="app-essay" class="hidden">Verborgenes Feld zum Abgabe-Text</label>
    <div class="tinyWrapper">
      <editor
          id="app-essay"
          v-model="essayStore.currentContent"
          @init="handleInit"
          @change="handleChange"
          @keyup="handleKeyUp"
          @keydown="layoutStore.handleKeyDown"
          @copy="helper.handleCopy"
          @cut="helper.handleCopy"
          api-key="no-api-key"
          :init="helper.getInit()"
      />
    </div>
    <div v-show="preferencesStore.word_count_enabled" class="wordCountWrapper">
      <v-btn variant="text" size="small" @click="preferencesStore.toggleWordCountCharacters()"
             :text="preferencesStore.word_count_characters ? helper.characterCount.value + ' Zeichen' : helper.wordCount.value + ' Wörter' ">
      </v-btn>
    </div>
  </div>
</template>

<style scoped>
#app-essay-edit-wrapper {
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
