<script setup>
import { useLayoutStore } from '@/store/layout';
import { useResourcesStore } from '@/store/resources';
import { useAnnotationsStore } from '@/store/annotations';
import Annotation from "@/data/Annotation";
import { nextTick, watch, isProxy, toRaw } from 'vue';

const layoutStore = useLayoutStore();
const resourcesStore = useResourcesStore();
const annotationsStore = useAnnotationsStore();

const resource = resourcesStore.getInstruction;

const demoAnnotations = {
  // "pdfjs_internal_editor_0": {
  //   "annotationType": 3,
  //   "color": [0, 0, 0],
  //   "fontSize": 10,
  //   "value": "Hello World",
  //   "pageIndex": 0,
  //   "rect": [67.5, 543, 119, 556.5],
  //   "rotation": 0
  // },
  // "pdfjs_internal_editor_1": {
  //   "annotationType": 15,
  //   "color": [255, 0, 0],
  //   "thickness": 3,
  //   "opacity": 1,
  //   "paths": [{
  //     "bezier": [
  //       1.5, 25.727771084724367, 2.8040804485100495, 27.031851533234402,
  //       5.396811581133676, 23.25556095123241, 6, 22.727771084724367,
  //       10.45407020558315, 18.830459654839103, 15.981183968598401,
  //       16.364531104350363, 21, 13.227771084724367, 25.88795894206055,
  //       10.172796745936523, 37.988543516372076, 5.739227568352277, 42,
  //       1.7277710847243668
  //     ],
  //     "points": [
  //       1.5, 25.727771084724367, 5.225791198862495, 23.602568747729173,
  //       4.012834511116397, 24.914722452856147, 6, 22.727771084724367, 21,
  //       13.227771084724367, 37.71378602219673, 4.78737352236285,
  //       31.828688421912233, 7.836451889039392, 42, 1.7277710847243668
  //     ]
  //   }],
  //   "pageIndex": 0,
  //   "rect": [71.5, 534.5, 115, 562],
  //   "rotation": 0
  // },
  "pdfjs_internal_editor_0": {
    "annotationType": 9,
    "pageIndex": 0,
    "methodOfCreation": "floating_button",
    "boxes": [{
      "x": 0.5887892513531741,
      "y": 0.5497833727963876,
      "width": 0.3175635230915429,
      "height": 0.014731369150779897
    }, {
      "x": 0.5179932598575883,
      "y": 0.5639948059822493,
      "width": 0.38830344024795055,
      "height": 0.011322933838313745
    }, {
      "x": 0.5179932598575883,
      "y": 0.5622905817147558,
      "width": 0.38830344024795055,
      "height": 0.014731369150779897
    }, {
      "x": 0.5179932598575883,
      "y": 0.5748844774798256,
      "width": 0.1696935747770985,
      "height": 0.014731369150779897
    }],
    "anchorNode": {},
    "anchorOffset": 11,
    "focusNode": {},
    "focusOffset": 28,
    "text": ""
  }
}

let pdfLib = null;
let pdfConstants = null;
let pdfOptions = null;
let pdfApp = null;
let pdfDoc = null;
let pdfAnnotationsUi = null;

async function handleIframeLoaded(event) {

  const win = event.target.contentWindow;

  pdfLib = win.pdfjsLib;
  pdfConstants = win.PDFViewerApplicationConstants;
  pdfOptions = win.PDFViewerApplicationOptions;
  pdfApp = win.PDFViewerApplication;

  pdfApp.eventBus.on('pagesloaded', async function (event) {
    pdfDoc = pdfApp.pdfDocument;
    //await initAnnotations();
  });

  pdfApp.pdfViewer.eventBus.on('annotationeditoruimanager', async function (object) {
    pdfAnnotationsUi = object.uiManager;
  });

}

async function handleFocusChange() {
  if (layoutStore.focusTarget == 'left' && layoutStore.isInstructionsPdfVisible) {
    await nextTick();
    document.getElementById('app-instructions-pdf').focus();
  }
}

watch(() => layoutStore.focusChange, handleFocusChange);


/**
 * Load the annotation to the storage before the document is displayed
 */
async function initAnnotations() {
  const entries = Object.entries(demoAnnotations);
  const pdfStorage = pdfDoc._transport.annotationStorage;
  for (const [key, annotation] of Object.entries(demoAnnotations)) {
    pdfStorage.setValue(key, annotation);
  }
}

/**
 * Load the annotations in the ui
 */
async function loadAnnotations() {
  for (const [key, annotation] of Object.entries(demoAnnotations)) {
    const page = pdfApp.pdfViewer._pages[annotation.pageIndex];

    pdfAnnotationsUi.switchToMode(annotation.annotationType, () => {});
    const editor = page.annotationEditorLayer.annotationEditorLayer.createAndAddNewEditor({x: 0, y: 0}, false, annotation);
    pdfAnnotationsUi.unselectAll();
    // pdfAnotationsUi.switchToMode(0, () => {});
    // pdfAnotationsUi.setEditingState(false);
    // page.annotationEditorLayer.annotationEditorLayer.updateToolbar(pdfAnotationsUi.getMode());
    //editor.setInBackground();
  }



  // page.annotationEditorLayer.annotationEditorLayer.highlightSelection(methodOfCreation);
}


async function saveAnnotations() {
  const pdfStorage = pdfDoc._transport.annotationStorage;
  const pdfAnnotations = pdfStorage.getAll();

  const annotations = [];
  for (const key in pdfAnnotations) {
    const value = pdfStorage.getValue(key, {});
    console.log(value);
    annotations.push(new Annotation({
      resource_key: resource.key,
      local_key: key,
      value: value
    }))
  }
  annotationsStore.saveAnnotationsForResource(resource.key, annotations);
}


</script>

<template>
  <div id="app-instructions-pdf-wrapper">
    <div class="appTextButtons">
      <v-btn-group density="comfortable" variant="outlined" divided>
        <v-btn title="Load Annotations" size="small" @click="loadAnnotations">Markierungen laden</v-btn>
        <v-btn title="Save Annotations" size="small" @click="saveAnnotations">Markierungen speichern</v-btn>
      </v-btn-group>
    </div>
    <iframe id="app-instructions-pdf" tabindex="0"
            :title="resource.title"
            :src="'./pdfjs-dist/web/viewer.html?file=' + encodeURIComponent(resource.url)"
            @load="handleIframeLoaded"
            frameborder="0"
    ></iframe>
  </div>
</template>


<style scoped>

#app-instructions-pdf-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.appTextButtons {
  text-align: center;
  padding-bottom: 5px;
  height: 50px;
}

#app-instructions-pdf {
  flex-grow: 1;
  width: 100%;
  height: calc(100% - 50px);
}

</style>
