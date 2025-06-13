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
    <img :src="resource.url" :alt="resource.title" tabindex="0" ref="focusMe"/>
  </div>
</template>
