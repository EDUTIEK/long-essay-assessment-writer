<script setup>
import { useTaskStore } from '@/store/task';
import { useLayoutStore } from '@/store/layout';
import { usePreferencesStore } from "@/store/preferences";
import { useClipbardStore } from "@/store/clipboard";
import { nextTick, watch } from 'vue';

const taskStore = useTaskStore();
const layoutStore = useLayoutStore();
const preferencesStore = usePreferencesStore();
const clipboardStore = useClipbardStore();

async function handleFocusChange() {
  if (layoutStore.focusTarget == 'left' && layoutStore.isInstructionsVisible) {
    await nextTick();
    document.getElementById('app-instructions').focus();
  }
}

watch(() => layoutStore.focusChange, handleFocusChange);

/**
 * Handle copy to the clipboard
 * @param {ClipboardEvent} event
 */
function handleCopy(event) {

  const content = getHTMLOfSelection();
  console.log(content);

  clipboardStore.setContent(content);
  event.clipboardData.setData('text/html', content);
  event.preventDefault();
}

function handleBeforeinput(event) {
  event.preventDefault();
  return false;
}

/**
 * Get an HTML string from the selected text
 * @see https://stackoverflow.com/questions/5083682/get-selected-html-in-browser-via-javascript
 */
function getHTMLOfSelection() {
  var range;
  if (document.selection && document.selection.createRange) {
    range = document.selection.createRange();
    return range.htmlText;
  } else if (window.getSelection) {
    var selection = window.getSelection();
    if (selection.rangeCount > 0) {
      range = selection.getRangeAt(0);
      var clonedSelection = range.cloneContents();
      var div = document.createElement('div');
      div.appendChild(clonedSelection);
      return div.innerHTML;
    } else {
      return '';
    }
  } else {
    return '';
  }
}


</script>

<template>
  <div id="app-instructions-wrapper">
    <div class="appTextButtons">
      <v-btn-group density="comfortable" variant="outlined" divided>
        <v-btn title="Aufgabenstellung Text verkleinern" size="small" icon="mdi-magnify-minus-outline"
               @click="preferencesStore.zoomInstructionsOut()"></v-btn>
        <v-btn title="Aufgabenstellung Text vergrößern" size="small" icon="mdi-magnify-plus-outline"
               @click="preferencesStore.zoomInstructionsIn()"></v-btn>
      </v-btn-group>
    </div>
    <div id="app-instructions" class="app-instructions-scroll long-essay-content"
         contenteditable="true"
         :style="'font-size:' + (preferencesStore.instructions_zoom) + 'rem;'"
         v-html="taskStore.instructions"
         @beforeinput="handleBeforeinput"
         @copy="handleCopy"
         @cut="handleCopy"
    >
    </div>
  </div>
</template>

<style>
/**
Must be global because of v-html used for the instructions
*/
@import '@/styles/content.css';

</style>

<style scoped>

#app-instructions-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.appTextButtons {
  text-align: center;
  padding-bottom: 5px;
}

.app-instructions-scroll {
  flex-grow: 1;
  width: 100%;
  padding: 20px;
  border: 1px solid #cccccc;
  overflow-y: scroll;
}


</style>
