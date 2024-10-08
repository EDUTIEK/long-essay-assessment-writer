<script setup>
import { useLayoutStore } from '@/store/layout';
import { useResourcesStore } from '@/store/resources';
import { nextTick, watch } from 'vue';

const layoutStore = useLayoutStore();
const resourcesStore = useResourcesStore();
const resource = resourcesStore.getInstruction;

let pdfApp = null;
let pdfConstants = null;
let pdfOptions = null;
let pdfLib = null;
let pdfDoc = null;

async function loaded(event) {

  const win = event.target.contentWindow;

  pdfApp = win.PDFViewerApplication;
  pdfConstants = win.PDFViewerApplicationConstants;
  pdfOptions = win.PDFViewerApplicationOptions;
  pdfLib = win.pdfjsLib;

  // this works!
  // win.addEventListener("keydown", logEvent)

  console.log(pdfApp);


  pdfApp.eventBus.on('pagesloaded', async function(event) {
    pdfDoc = pdfApp.pdfDocument;
    console.log(pdfDoc);
  });


  // seems not to be needed, objects are already there in load event
  // https://medium.com/@chhavikhandelwal/ensuring-smooth-execution-how-to-wait-for-objects-on-window-load-in-javascript-a39fbd1d2e73
  // const intervalId = setInterval(() => {
  //   if (window.thatObject) {
  //     clearInterval(intervalId);
  //     resolve(window.thatObject);
  //   }
  // }, 100);
}

async function logEvent(event) {
  console.log(event);
}


async function handleFocusChange() {
  if (layoutStore.focusTarget == 'left' && layoutStore.isInstructionsPdfVisible) {
    await nextTick();
    document.getElementById('app-instructions-pdf').focus();
  }
}
watch(() => layoutStore.focusChange, handleFocusChange);


async function test() {
  const storage = pdfDoc._transport.annotationStorage;
  const annotations = storage.getAll();

  for (const key in annotations) {
    const value = storage.getValue(key, {});
    console.log(value);
  }

  // let num = 1;
  // while (num <= pdfDoc.numPages) {
  //   const page = await pdfDoc.getPage(num);
  //   const annotations = await page.getAnnotations();
  //   console.log(page);
  //   num++;
  // }
}


</script>

<template>
  <div id="app-instructions-pdf-wrapper">
    <div class="appTextButtons">
      <v-btn-group density="comfortable" variant="outlined" divided>
        <v-btn title="Test" size="small" @click="test()">Test</v-btn>
      </v-btn-group>
    </div>
    <iframe id="app-instructions-pdf" tabindex="0"
        :title="resource.title"
        :src="'./pdfjs-dist/web/viewer.html?file=' + encodeURIComponent(resource.url)"
        @load="loaded"
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
