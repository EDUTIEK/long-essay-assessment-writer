<script setup>
import { useLayoutStore } from '@/store/layout';
import { nextTick, ref, watch } from 'vue';
const { resource } = defineProps(['resource']);
const focusMe = ref();
const layoutStore = useLayoutStore();
watch(() => layoutStore.focusChange, () => layoutStore.isResourceShown(resource) && nextTick().then(() => focusMe.value.focus()));
</script>

<template>
  <div class="appResourceWrapper">
    <video controls :aria-label="resource.title" tabindex="0" ref="focusMe">
      <source :src="resource.url" :type="resource.mime">
      Your browser does not support the video element.
    </video>
  </div>
</template>
