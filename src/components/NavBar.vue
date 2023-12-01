<script setup>
import { useLayoutStore } from "@/store/layout";
import { useResourcesStore } from "@/store/resources";
import { useTaskStore } from '@/store/task';
import { useSettingsStore } from "@/store/settings";
import { useApiStore } from "@/store/api";

const layoutStore = useLayoutStore();
const resourcesStore = useResourcesStore();
const taskStore = useTaskStore();
const settingsStore = useSettingsStore();
const apiStore = useApiStore();

function openNavigation() {
  document.getElementById('app-navigation-drawer').dispatchEvent(new Event('mouseenter'));
}

function closeNavigation() {
  document.getElementById('app-navigation-drawer').dispatchEvent(new Event('mouseleave'));
}

function selectResource(resource) {
  if (resource.type == 'url') {
    window.open(resource.source, 'long-essay-writer-resource-' + resource.key)
  }
  else {
    resourcesStore.selectResource(resource);
    layoutStore.showResources();
  }
}

function getResourceIcon(resource) {
  switch (resource.type) {
    case "url":
      return (resourcesStore.isActive(resource) && layoutStore.isResourcesVisible) ? "mdi-file-link" : "mdi-file-link-outline"
    default:
      return (resourcesStore.isActive(resource) && layoutStore.isResourcesVisible) ? "mdi-file" : "mdi-file-outline"
  }
}

</script>

<template>
  <v-navigation-drawer id="app-navigation-drawer" elevation="2" width="500" permanent rail expand-on-hover>

    <v-list>
      <v-list-item v-show="taskStore.hasInstructions" @click="layoutStore.showInstructions(); closeNavigation();"
                   :prepend-icon="layoutStore.isInstructionsVisible ? 'mdi-text-box': 'mdi-text-box-outline'"
                   title="Aufgabenstellung">
      </v-list-item>

      <v-list-item v-show="resourcesStore.hasInstruction" @click="layoutStore.showInstructionsPdf(); closeNavigation();"
                   :prepend-icon="layoutStore.isInstructionsPdfVisible ? 'mdi-text-box': 'mdi-text-box-outline'"
                   title="Aufgabenstellung (PDF)">
      </v-list-item>

      <v-list-item @click="layoutStore.showEssay(); closeNavigation();"
                   :prepend-icon="layoutStore.isEssayVisible ? 'mdi-file-edit': 'mdi-file-edit-outline'"
                   title="Abgabe-Text">
      </v-list-item>

      <v-list-item v-if="settingsStore.hasNotes" @click="layoutStore.showNotes(); closeNavigation();"
                   :prepend-icon="layoutStore.isNotesVisible ? 'mdi-clipboard': 'mdi-clipboard-outline'"
                   title="Notizen (werden bei der Abgabe verworfen)">
      </v-list-item>


      <v-list-group v-show="resourcesStore.hasFileOrUrlResources">
        <template v-slot:activator="{ props }">
          <v-list-item active-class="appNavActive" v-bind="props"
                       @mouseenter="openNavigation()"
                       :prepend-icon="layoutStore.isResourcesVisible ? 'mdi-book-open' : 'mdi-book-open-outline'"
                       color="grey-darken-4"
                       title="Material">
          </v-list-item>
        </template>

        <v-list-item v-for="resource in resourcesStore.getFileOrUrlResources"
                     @click="selectResource(resource); closeNavigation();"
                     :prepend-icon="getResourceIcon(resource)"
                     :title="resource.title"
                     :key="resource.key">
        </v-list-item>

      </v-list-group>


      <!-- <v-list-item prepend-icon="mdi-clipboard-outline" title="Notizbrett"></v-list-item>-->
    </v-list>

    <template v-slot:append>
      <v-list>
        <v-list-item
          :disabled="apiStore.isAllSent"
          :prepend-icon="apiStore.isSending ? 'mdi-cloud-upload' : (apiStore.isAllSent ? 'mdi-cloud-check-outline' : 'mdi-cloud-outline')"
          :title="apiStore.isSending ? 'Änderungen werden gesendet' : (apiStore.isAllSent ? 'Alles gesendet' : 'Noch Änderungen zu senden')"
        ></v-list-item>
      </v-list>
    </template>


  </v-navigation-drawer>
</template>

<style scoped>

.v-list {
  overflow-x: hidden;
  background-color: #fafafa;
}

/* avoid highlight, when selected, see also App.vue */
.v-list-item, v-list-group {
  color: #000000 !important;
}

</style>
