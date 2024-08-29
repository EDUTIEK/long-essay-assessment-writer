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
                    :title="'Aufgabenstellung' + (layoutStore.isInstructionsVisible ? ' (ausgewählt)' : '')">
          <template v-slot:prepend>
            <v-icon :title="'Aufgabenstellung' + (layoutStore.isInstructionsVisible ? ' (ausgewählt)' : '')"
                    :icon="layoutStore.isInstructionsVisible ? 'mdi-text-box': 'mdi-text-box-outline'"></v-icon>
          </template>
      </v-list-item>

      <v-list-item v-show="resourcesStore.hasInstruction" @click="layoutStore.showInstructionsPdf(); closeNavigation();"
                  :title="'Aufgabenstellung als PDF' + (layoutStore.isInstructionsPdfVisible ? ' (ausgewählt)' : '')">
        <template v-slot:prepend>
          <v-icon :title="'Aufgabenstellung als PDF' + (layoutStore.isInstructionsPdfVisible ? ' (ausgewählt)' : '')"
                  :icon="layoutStore.isInstructionsPdfVisible ? 'mdi-text-box': 'mdi-text-box-outline'"></v-icon>
        </template>
      </v-list-item>

      <v-divider class="border-opacity-75" ></v-divider>

      <v-list-item @click="layoutStore.showEssay(); closeNavigation();"
                  :title="'Abgabe-Text' + (layoutStore.isEssayVisible ? ' (ausgewählt)' : '')">
        <template v-slot:prepend>
          <v-icon :title="'Abgabe-Text' + (layoutStore.isEssayVisible ? ' (ausgewählt)' : '')"
                  :icon="layoutStore.isEssayVisible ? 'mdi-file-edit': 'mdi-file-edit-outline'"></v-icon>
        </template>
      </v-list-item>

      <v-list-item v-if="settingsStore.hasNotes" @click="layoutStore.showNotes(); closeNavigation();"
                   :title="'Notizen, werden bei der Abgabe verworfen' + (layoutStore.isNotesVisible ? ' (ausgewählt)' : '')">
        <template v-slot:prepend>
          <v-icon :title="'Notizen, werden bei der Abgabe verworfen' + (layoutStore.isNotesVisible ? ' (ausgewählt)' : '')"
                  :icon="layoutStore.isNotesVisible ? 'mdi-file-edit': 'mdi-file-edit-outline'"></v-icon>
        </template>
      </v-list-item>

      <v-divider class="border-opacity-75" ></v-divider>

      <v-list-item v-for="resource in resourcesStore.getFileOrUrlResources"
                   @click="selectResource(resource); closeNavigation();"
                   :title="resource.title + (resourcesStore.isActive(resource) && layoutStore.isResourcesVisible ? ' (ausgewählt)' : '')"
                   :key="resource.key">
        <template v-slot:prepend>
          <v-icon :title="resource.title + (resourcesStore.isActive(resource) && layoutStore.isResourcesVisible ? ' (ausgewählt)' : '')"
                  :icon="getResourceIcon(resource)"></v-icon>
        </template>
      </v-list-item>

    </v-list>

    <template v-slot:append>
      <v-list>
        <v-list-item
          :disabled="apiStore.isAllSent"
          :title="apiStore.isSending ? 'Änderungen werden gesendet' : (apiStore.isAllSent ? 'Alles gesendet' : 'Noch Änderungen zu senden')"
        >
          <template v-slot:prepend>
            <v-icon :title="apiStore.isSending ? 'Änderungen werden gesendet' : (apiStore.isAllSent ? 'Alles gesendet' : 'Noch Änderungen zu senden')"
                    :icon="apiStore.isSending ? 'mdi-cloud-upload' : (apiStore.isAllSent ? 'mdi-cloud-check-outline' : 'mdi-cloud-outline')"></v-icon>
          </template>
        </v-list-item>
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
/*
.v-list-item, v-list-group {
  color: #000000 !important;
}
*/


</style>
