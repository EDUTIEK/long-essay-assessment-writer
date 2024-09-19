<script setup>
import {useLayoutStore} from '@/store/layout';
import {useResourcesStore} from '@/store/resources';
import { nextTick, watch } from 'vue';

const layoutStore = useLayoutStore();
const resourcesStore = useResourcesStore();
const resource = resourcesStore.getInstruction;

async function handleFocusChange() {
  if (layoutStore.focusTarget == 'left' && layoutStore.isInstructionsPdfVisible) {
    await nextTick();
    document.getElementById('app-instructions-pdf').focus();
  }
}
watch(() => layoutStore.focusChange, handleFocusChange);
</script>

<template>
  <div id="app-instructions-pdf" tabindex="0">
    <object
      v-if="resource.mimetype =='application/pdf'"
      type="application/pdf"
      :data="resource.url"
      width="100%"
      height="100%">
    </object>
  </div>
</template>


<style scoped>

div {
  height:100%;
}

</style>
