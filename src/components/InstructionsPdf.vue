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

let pdfLib = null;
let pdfConstants = null;
let pdfOptions = null;
let pdfApp = null;
let pdfDoc = null;

async function handleIframeLoaded(event) {

  const win = event.target.contentWindow;

  // enhable app hotkeys in pdf frame
  win.addEventListener("keydown", layoutStore.handleKeyDown);

  // seems not to be needed, objects are already there in load event
  // https://medium.com/@chhavikhandelwal/ensuring-smooth-execution-how-to-wait-for-objects-on-window-load-in-javascript-a39fbd1d2e73

  pdfLib = win.pdfjsLib;
  pdfConstants = win.PDFViewerApplicationConstants;
  pdfOptions = win.PDFViewerApplicationOptions;
  pdfApp = win.PDFViewerApplication;
  //console.log(pdfApp);

  pdfApp.eventBus.on('pagesloaded', async function (event) {
    pdfDoc = pdfApp.pdfDocument;
    //console.log(pdfDoc);
  });
}

async function handleFocusChange() {
  if (layoutStore.focusTarget == 'left' && layoutStore.isInstructionsPdfVisible) {
    await nextTick();
    document.getElementById('app-instructions-pdf').focus();
  }
}

watch(() => layoutStore.focusChange, handleFocusChange);


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

async function loadAnnotations() {
  const pdfStorage = pdfDoc._transport.annotationStorage;

  for (const annotation of annotationsStore.getAnnotationsForResource(resource.key)) {
    const raw = isProxy(annotation.value) ? toRaw(annotation.value) : annotation.value;
    console.log(raw);
    pdfStorage.setValue(annotation.local_key, annotation.value);
  }
}

</script>

<template>
  <div id="app-instructions-pdf-wrapper">
    <div class="appTextButtons">
      <v-btn-group density="comfortable" variant="outlined" divided>
        <v-btn title="Load Annotations" size="small" @click="loadAnnotations">Load Annotations</v-btn>
        <v-btn title="Save Annotations" size="small" @click="saveAnnotations">Save Annotations</v-btn>
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
