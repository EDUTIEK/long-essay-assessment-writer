<script setup>
import { useLayoutStore } from '@/store/layout';
import { useResourcesStore } from '@/store/resources';
import { useAnnotationsStore } from '@/store/annotations';
import Annotation from "@/data/Annotation";
import createPDFJsApi from 'annotate-pdf/pdfjs-api';

import { nextTick,  onMounted, ref, watch, isProxy, toRaw } from 'vue';

const layoutStore = useLayoutStore();
const resourcesStore = useResourcesStore();
const annotationsStore = useAnnotationsStore();

const instructionsNode = ref();
const resource = resourcesStore.getInstruction;

let pdfjs;

onMounted(() => {
  pdfjs = createPDFJsApi(instructionsNode.value, './annotate-pdf/pdfjs-dist/web/viewer.html', resource.url);
  //loadAnnotations();
  ['create', 'update', 'delete'].forEach(event => pdfjs.on(event, saveAnnotations));
});

async function handleFocusChange() {
  if (layoutStore.focusTarget == 'left' && layoutStore.isInstructionsPdfVisible) {
    await nextTick();
    document.getElementById('app-instructions-pdf').focus();
  }
}
watch(() => layoutStore.focusChange, handleFocusChange);

async function loadAnnotations() {
  const all = [];
  for (const annotation of annotationsStore.getAnnotationsForResource(resource.key)) {
   console.log(annotation);
    all.push({
      id: annotation.local_key,
      page: annotation.parent_number,
      intern: JSON.parse(annotation.value),
    })
  }

  pdfjs.setAll(all);
}

async function saveAnnotations(event) {
  const all = await pdfjs.getAll();

  const annotations = [];
  for (const raw of all) {
    console.log(raw);
    annotations.push(
        new Annotation(
            {
              resource_key: resource.key,
              local_key: raw.id,
              parent_number: raw.page,
              value: JSON.stringify(raw.intern),
            }
        )
    )
  }

  annotationsStore.loadFromData(annotations);
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
    <div id="app-instructions-pdf" tabindex="0" ref="instructionsNode"></div>
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
