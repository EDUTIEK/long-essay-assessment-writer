<script setup>
import { useLayoutStore } from '@/store/layout';
import { useResourcesStore } from '@/store/resources';
import { nextTick, watch } from 'vue';

const layoutStore = useLayoutStore();
const resourcesStore = useResourcesStore();

async function handleFocusChange() {
  if (layoutStore.focusTarget == 'left' && layoutStore.isResourcesVisible) {
    await nextTick();
    document.getElementById('app-resources').focus();
  }
}

watch(() => layoutStore.focusChange, handleFocusChange);
</script>

<template>
  <div id="app-resources" tabindex="0" class="resources">
    <template v-for="resource in resourcesStore.resources" :key="resource.key">
      <div v-if="resource.type=='file'" v-show="resourcesStore.isActive(resource)">
        <!--
        <p><a :target= "'long-essay-writer-resource-' + resource.key" :href="apiStore.getResourceUrl(resource.key)">{{ resource.title }}</a></p>
        -->
        <object
            v-if="resource.mimetype =='application/pdf'"
            type="application/pdf"
            :data="resource.url"
            width="100%"
            height="100%">
        </object>
      </div>

    </template>
  </div>
</template>


<style scoped>

div {
  height: 100%;
}

</style>
