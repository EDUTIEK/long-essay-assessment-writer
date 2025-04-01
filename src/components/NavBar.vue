<script setup>
import { useLayoutStore } from "@/store/layout";
import { useResourcesStore } from "@/store/resources";
import { useTaskStore } from '@/store/task';
import { useSettingsStore } from "@/store/settings";
import { useApiStore } from "@/store/api";
import { nextTick, watch } from 'vue';
import Resource from "@/data/Resource";

const layoutStore = useLayoutStore();
const resourcesStore = useResourcesStore();
const taskStore = useTaskStore();
const settingsStore = useSettingsStore();
const apiStore = useApiStore();

async function handleFocusChange() {
  if (layoutStore.focusTarget == 'navigation') {
    await nextTick();
    for (const element of document.getElementsByClassName('app-navigation-item')) {
      element.focus();
      break;
    }
  }
}

watch(() => layoutStore.focusChange, handleFocusChange);

function openNavigation(event) {
  document.getElementById('app-navigation-drawer').dispatchEvent(new Event('mouseenter'));
}

function closeNavigation(event) {
  document.getElementById('app-navigation-drawer').dispatchEvent(new Event('mouseleave'));
}

function selectResource(resource) {
  if (resource.type == Resource.TYPE_URL && !resource.embedded) {
    window.open(resource.source, 'long-essay-writer-resource-' + resource.key)
  } else {
    resourcesStore.selectResource(resource);
    layoutStore.showResources();
  }
}

function handleKey(event) {
  if (event.keyCode == 27) {
    closeNavigation();
  } else {
    layoutStore.handleKeyDown(event);
  }
}

function getResourceIcon(resource) {
  if (resource.isExternalUrl()) {
    return "mdi-link"
  }
  else if (resource.isEmbeddedUrl()) {
    return (resourcesStore.isActive(resource) && layoutStore.isResourcesVisible) ? "mdi-link-box" : "mdi-link-box-outline"
  }
  else {
    return (resourcesStore.isActive(resource) && layoutStore.isResourcesVisible) ? "mdi-file" : "mdi-file-outline"
  }
}

</script>

<template>
  <v-navigation-drawer id="app-navigation-drawer" elevation="2" width="500" permanent rail expand-on-hover
                       @focusin="openNavigation"
                       @focusout="closeNavigation"
                       @keydown="handleKey"
  >
    <!--
      Put list items instead of the whole list in the tab sequence
      https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex
    -->
    <v-list tabindex="-1">
      <v-list-item aria-role="button" class="app-navigation-item" tabindex="0" v-show="taskStore.hasInstructions"
                   @click="closeNavigation; layoutStore.showInstructions();"
                   :aria-label="'Aufgabenstellung' + (layoutStore.isInstructionsVisible ? ', ist ausgewählt' : '')"
                   :title="'Aufgabenstellung' + (layoutStore.isInstructionsVisible ? ' (ausgewählt)' : '')"
                   :ripple="false">
        <template v-slot:prepend>
          <v-icon aria-role="hidden"
                  :icon="layoutStore.isInstructionsVisible ? 'mdi-text-box': 'mdi-text-box-outline'"></v-icon>
        </template>
      </v-list-item>

      <v-list-item aria-role="button" class="app-navigation-item" tabindex="0" v-show="resourcesStore.hasInstruction"
                   @click="closeNavigation; layoutStore.showInstructionsPdf();"
                   :aria-label="'Aufgabenstellung als PDF' + (layoutStore.isInstructionsPdfVisible ? ', ist ausgewählt' : '')"
                   :title="'Aufgabenstellung als PDF' + (layoutStore.isInstructionsPdfVisible ? ' (ausgewählt)' : '')"
                   :ripple="false">
        <template v-slot:prepend>
          <v-icon aria-role="hidden"
                  :icon="layoutStore.isInstructionsPdfVisible ? 'mdi-text-box': 'mdi-text-box-outline'"></v-icon>
        </template>
      </v-list-item>

      <v-divider class="border-opacity-75"></v-divider>

      <v-list-item aria-role="button" class="app-navigation-item" tabindex="0"
                   @click="closeNavigation; layoutStore.showEssay();"
                   :aria-label="'Abgabe-Text' + (layoutStore.isEssayVisible ? ', ist ausgewählt' : '')"
                   :title="'Abgabe-Text' + (layoutStore.isEssayVisible ? ' (ausgewählt)' : '')"
                   :ripple="false">
        <template v-slot:prepend>
          <v-icon aria-role="hidden"
                  :icon="layoutStore.isEssayVisible ? 'mdi-file-edit': 'mdi-file-edit-outline'"></v-icon>
        </template>
      </v-list-item>

      <v-list-item aria-role="button" class="app-navigation-item" tabindex="0" v-if="settingsStore.hasNotes"
                   @click="closeNavigation; layoutStore.showNotes();"
                   :aria-label="'Notizen, werden bei der Abgabe verworfen' + (layoutStore.isNotesVisible ? ', ist ausgewählt' : '')"
                   :title="'Notizen, werden bei der Abgabe verworfen' + (layoutStore.isNotesVisible ? ' (ausgewählt)' : '')"
                   :ripple="false">
        <template v-slot:prepend>
          <v-icon aria-role="hidden"
                  :icon="layoutStore.isNotesVisible ? 'mdi-file-edit': 'mdi-file-edit-outline'"></v-icon>
        </template>
      </v-list-item>

      <v-divider class="border-opacity-75"></v-divider>

      <v-list-item aria-role="button" class="app-navigation-item" tabindex="0"
                   v-for="resource in resourcesStore.getFileOrUrlResources"
                   @click="closeNavigation; selectResource(resource);"
                   :aria-label="resource.title + (resourcesStore.isActive(resource) && layoutStore.isResourcesVisible ?  ', ist ausgewählt' : '')"
                   :title="resource.title + (resourcesStore.isActive(resource) && layoutStore.isResourcesVisible ? ' (ausgewählt)' : '')"
                   :key="resource.key"
                   :ripple="false">
        <template v-slot:prepend>
          <v-icon aria-role="hidden"
                  :icon="getResourceIcon(resource)"></v-icon>
        </template>
      </v-list-item>
    </v-list>

    <template v-slot:append>
      <v-list tabindex="-1">
        <v-list-item
            tabindex="-1"
            disabled
            :aria-label="apiStore.isSending ? 'Änderungen werden gesendet' : (apiStore.isAllSent ? 'Alles gesendet' : 'Noch Änderungen zu senden')"
            :title="apiStore.isSending ? 'Änderungen werden gesendet' : (apiStore.isAllSent ? 'Alles gesendet' : 'Noch Änderungen zu senden')"
        >
          <template v-slot:prepend>
            <v-icon aria-role="hidden"
                    :icon="apiStore.isSending ? 'mdi-cloud-upload' : (apiStore.isAllSent ? 'mdi-cloud-check-outline' : 'mdi-cloud-outline')"></v-icon>
          </template>
        </v-list-item>
      </v-list>
    </template>


  </v-navigation-drawer>
</template>

<style scoped>


button {
  width: 100%;
  justify-content: left;
  text-align: left;
}


.v-list {
  overflow-x: hidden;
  background-color: #fafafa;
}

.v-list-item {
  background-color: #fafafa !important;
}


</style>
