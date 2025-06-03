<script setup>
import { useAnnotationsStore } from "@/store/annotations";
import Annotation from '@/components/Annotation.vue';
import { nextTick, watch } from 'vue';
import {useLayoutStore} from "@/store/layout";

const annotationsStore = useAnnotationsStore();
const layoutStore = useLayoutStore()

/**
 * Focus the currently selected annotation
 */
async function focusSelected() {
  await nextTick();
  let el = document.getElementById('appAnnotationContainer' + annotationsStore.selectedKey);
  if (el) {
    let tx = el.querySelector('textarea');
    if (tx) {
      tx.focus();
    }
  }
}

watch(() => annotationsStore.selectionChange, focusSelected);
watch(() => layoutStore.focusChange, focusSelected);


/**
 * Set the scrolling so that the complete annotation is visible
 */
async function scrollToFirstVisible() {
  await nextTick();
  let el = document.getElementById('appAnnotationContainer' + annotationsStore.firstVisibleKey);
  if (el) {
    el.scrollIntoView();
  }
}

watch(() => annotationsStore.firstVisibleKey, scrollToFirstVisible);

</script>

<template>
  <div id="appAnnotations">
    <Annotation v-for="annotation in annotationsStore.activeAnnotations" :key="annotation.getKey()" :annotation="annotation"></Annotation>
  </div>
</template>

<style scoped>

#appAnnotations {
  overflow-y: scroll;
  overflow-x: clip;
}

</style>
