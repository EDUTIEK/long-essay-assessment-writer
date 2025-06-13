<script setup>
import {useLayoutStore} from '@/store/layout';
import {useResourcesStore} from '@/store/resources';
import ResourcePdf from "@/components/ResourcePdf.vue";
import ResourceUrl from "@/components/ResourceUrl.vue";
import ResourceVideo from "@/components/ResourceVideo.vue";
import ResourceAudio from "@/components/ResourceAudio.vue";
import ResourceImage from "@/components/ResourceImage.vue";

const layoutStore = useLayoutStore();
const resourcesStore = useResourcesStore();

const componentMap = {
  isPdf: ResourcePdf,
  isVideo: ResourceVideo,
  isAudio: ResourceAudio,
  isImage: ResourceImage,
  isEmbeddedUrl: ResourceUrl,
};

function component(r)
{
  return Object.entries(componentMap).find(([is, c]) => r[is]())[1];
}

</script>

<template>
  <div id="app-resources" tabindex="0" class="resources">
    <template v-for="resource in resourcesStore.resources" :key="resource.key">
    <!-- If the state needs to be kept wrap this with a KeepAlive component: https://vuejs.org/guide/built-ins/keep-alive -->
      <component :is="component(resource)"
                 v-show="layoutStore.isResourceShown(resource)"
                 :resource="resource">
      </component>
    </template>
  </div>
</template>


<style scoped>

div {
  height: 100%;
}

</style>
