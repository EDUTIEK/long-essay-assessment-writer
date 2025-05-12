<script setup>
import { useTaskStore } from '@/store/task';
import { useLayoutStore } from '@/store/layout';
import { usePreferencesStore } from "@/store/preferences";
import { useClipbardStore } from "@/store/clipboard";
import {useAnnotationsStore} from "@/store/annotations";
import TextMarker from '@/lib/TextMarker';
import { ref, onMounted, nextTick, watch } from 'vue';
import Annotation from "@/data/Annotation";

const taskStore = useTaskStore();
const layoutStore = useLayoutStore();
const preferencesStore = usePreferencesStore();
const clipboardStore = useClipbardStore();
const annotationsStore = useAnnotationsStore();

const markingActive = ref(0);

let marker;

onMounted(() => {
  marker = new TextMarker(document.getElementById('app-instructions'), onSelection, onIntersection);
  refreshMarks();
});

function refreshMarks() {
  marker.hideAllMarksAndLabels();
  annotationsStore.activeAnnotations.forEach(annotation => updateMark(annotation));
}

watch(() => annotationsStore.markerChange, refreshMarks);

function refreshSelection() {
  marker.hideAllMarksOfClass('selected');

  let annotation = annotationsStore.getAnnotation(annotationsStore.selectedKey);
  if (annotation) {
    marker.showMark('selected', annotation.start_position, annotation.end_position);
    marker.addLabel('labelled', annotation.label, annotation.start_position);
    marker.scrollToMark(annotation.start_position, annotation.end_position);
  }
}

watch(() => annotationsStore.selectionChange, refreshSelection);

function setCaretToSelectedAnnotation()
{
  let annotation = annotationsStore.getAnnotation(annotationsStore.selectedKey);
  marker.setCaretToMark(annotation.start_position);
}

watch(() => annotationsStore.caretRequest, setCaretToSelectedAnnotation);

/**
 * Update the marking of an annotation
 */
function updateMark(annotation) {
  marker.showMark('marked', annotation.start_position, annotation.end_position);
  marker.addLabel('labelled', annotation.label, annotation.start_position);
}

/**
 * Handle the click into the text or a selection of a text range
 * Decide whether to add a new annotation or select an existing annotation
 */
async function onSelection(selected) {

  if (selected.isCollapsed) {
    // just clicked at a position => select the overlapping annotation
    const annotations = annotationsStore.getActiveAnotationsInRange(selected.firstWord, selected.lastWord);
    if (annotations.length) {
      const annotation = annotations.shift();
      annotationsStore.selectAnnotation(annotation.getKey());
    }
  }
  else if (markingActive.value === 1) {
    // selected text => create a new annotation
    marker.removeSelection();
    const annotation = new Annotation({
          resource_key: Annotation.KEY_INSTRUCTIONS,
          parent_number: selected.parentNumber,
          start_position: selected.firstWord,
          end_position: selected.lastWord
        });
    await annotationsStore.createAnnotation(annotation);
    annotationsStore.selectAnnotation(annotation.getKey());
  }
}

/**
 * Handle a annotation geting visible by scrolling
 * @param {int} firstWord
 */
function onIntersection(firstWord) {
  let annotations = annotationsStore.getActiveAnnotationsByStartPosition(firstWord);
  if (annotations.length) {
    let annotation = annotations.shift();
    annotationsStore.setFirstVisibleAnnotation(annotation.getKey());
  }
}

function setMarkingActive(active) {
  markingActive.value = active;
}

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
      <v-btn-toggle v-model="markingActive" density="comfortable" variant="outlined" divided>
        <v-btn aria-labelledby="app-instructions-mode-select" size="small" value="0"
               @click="setMarkingActive(0)">
          <v-icon icon="mdi-cursor-default-outline"></v-icon>
          <span class="sr-only" id="app-instructions-mode-select">Auswählen</span>
        </v-btn>
        <v-btn aria-labelledby="app-instructions-mode-mark"  size="small" value="1"
               @click="setMarkingActive(1)">
          <v-icon icon="mdi-marker"></v-icon>
          <span class="sr-only" id="app-instructions-mode-mark">Markieren</span>
        </v-btn>
      </v-btn-toggle>
      &nbsp;
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

<style>
/* Must be global because of v-html used for the instructions */

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

w-p.labelled:before {
  content: attr(label); /* value that that refers to CSS 'content' */
  position: relative;
  left: -3px;
  top: -7px;
  padding: 3px;
  z-index: 10000;
  background-color: #aaaaaaaa;
  color: white;
  font-family: sans-serif;
  font-size: 14px;
  font-style: normal;
  font-weight: normal;
  border-radius: 5px;
}

w-p.labelled.selected:before {
  background-color: #606060;
}

w-p.marked {
  background-color: #D8E5F4;
}

w-p.marked.selected {
  background-color: #94C3FC !important;
}

</style>
