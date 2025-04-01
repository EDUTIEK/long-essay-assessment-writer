<script setup>
import {useLayoutStore} from '@/store/layout';
import {useResourcesStore} from '@/store/resources';
import ResourcePdf from "@/components/ResourcePdf.vue";
import ResourceUrl from "@/components/ResourceUrl.vue";

const layoutStore = useLayoutStore();
const resourcesStore = useResourcesStore();

</script>

<template>
  <div id="app-resources" tabindex="0" class="resources">
    <template v-for="resource in resourcesStore.resources" :key="resource.key">


      <resource-pdf v-if="resource.isPdf()"
                    v-show="layoutStore.isResourceShown(resource)"
                    :key=resource.key
                    :resource="resource">
      </resource-pdf>

      <resource-url v-if="resource.isEmbeddedUrl()"
                    v-show="layoutStore.isResourceShown(resource)"
                    :key=resource.key
                    :resource="resource">
      </resource-url>

    </template>
  </div>
</template>


<style scoped>

div {
  height: 100%;
}

</style>
